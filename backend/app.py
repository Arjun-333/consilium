import asyncio
import re
import json
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI

load_dotenv()

app = FastAPI(
    title="Consilium API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

class IdeaRequest(BaseModel):
    idea: str
    provider: Optional[str] = "gemini"
    model: Optional[str] = "gemini-1.5-flash"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPTS_DIR = os.path.join(BASE_DIR, "..", "prompts")

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(PROMPTS_DIR, filename)

    if not os.path.exists(prompt_path):
        raise FileNotFoundError(f"Prompt not found: {prompt_path}")

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()

def get_client(provider: str):
    if provider == "ollama":
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        return AsyncOpenAI(base_url=base_url, api_key="ollama")
    
    if provider == "gemini":
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            # Fallback to general environment GEMINI_API_KEY
            api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(
                status_code=400, 
                detail="GEMINI_API_KEY is missing from environment. Set it in your backend/.env file, or switch to 'ollama' to run locally."
            )
        base_url = os.getenv("GEMINI_BASE_URL", "https://generativelanguage.googleapis.com/v1beta/openai/")
        return AsyncOpenAI(base_url=base_url, api_key=api_key)
        
    # OpenAI Provider
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=400, 
            detail="OPENAI_API_KEY is missing from environment. Set it in your backend/.env file, or switch to 'ollama' to run locally."
        )
    return AsyncOpenAI(api_key=api_key)

def get_score_metric_name(agent_key: str) -> str:
    metrics = {
        "visionary": "Vision Alignment",
        "product_lead": "Product Feasibility",
        "market_analyst": "Market Opportunity",
        "technology_lead": "Technical Feasibility",
        "finance_advisor": "Financial Viability",
        "risk_compliance": "Execution Safety (10 represents lowest risk/highest safety)",
        "strategy_growth": "Growth Potential"
    }
    return metrics.get(agent_key, "General Alignment")


@app.post("/evaluate/council")
async def evaluate_council(request: IdeaRequest):
    agents = [
        "visionary",
        "product_lead",
        "market_analyst",
        "technology_lead",
        "finance_advisor",
        "risk_compliance",
        "strategy_growth"
    ]

    provider = request.provider or "gemini"
    client = get_client(provider)
    
    if provider == "gemini":
        model = request.model or "gemini-1.5-flash"
    elif provider == "openai":
        model = request.model or "gpt-4o-mini"
    else:
        model = request.model or "llama3"

    async def run_agent(agent_key: str):
        try:
            prompt = load_prompt(f"{agent_key}.txt")
            metric = get_score_metric_name(agent_key)
            prompt += f"\n\nCRITICAL: At the end of your analysis, on a new line, you must output a score representing {metric} of the idea. Use this exact format:\n[SCORE]: X\nWhere X is an integer between 1 and 10."
            
            response = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": request.idea}
                ]
            )
            analysis = response.choices[0].message.content
            
            # Parse the score
            score_match = re.search(r"\[SCORE\]:\s*(\d+)", analysis)
            score = 7  # default fallback
            if score_match:
                try:
                    score = int(score_match.group(1))
                    score = max(1, min(10, score))
                except ValueError:
                    pass
            
            clean_analysis = re.sub(r"\[SCORE\]:\s*\d+", "", analysis).strip()
            return agent_key, clean_analysis, score
        except Exception as e:
            print(f"Error executing agent {agent_key}: {e}")
            return agent_key, f"[Error executing agent: {str(e)}]", 5

    # Execute all agent requests concurrently
    tasks = [run_agent(agent_key) for agent_key in agents]
    results = await asyncio.gather(*tasks)

    agent_outputs_dict = {}
    agent_scores_dict = {}
    
    for agent_key, clean_analysis, score in results:
        agent_outputs_dict[agent_key] = clean_analysis
        agent_scores_dict[agent_key] = score

    agent_outputs_formatted = []
    for agent_key in agents:
        analysis = agent_outputs_dict[agent_key]
        agent_outputs_formatted.append(f"--- {agent_key.replace('_', ' ').title()} ---\n{analysis}\n")

    # Aggregation
    aggregated_reports = "\n".join(agent_outputs_formatted)

    # Chairperson Synthesis
    try:
        chairperson_prompt = load_prompt("chairperson.txt")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chairperson prompt error: {str(e)}")

    final_prompt = f"""
    Original Idea: {request.idea}

    Agent Reports:
    {aggregated_reports}

    Based on the above reports, provide the final council decision.
    """

    try:
        final_response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": chairperson_prompt},
                {"role": "user", "content": final_prompt}
            ],
            response_format={"type": "json_object"}
        )
        decision_raw = final_response.choices[0].message.content
        decision = json.loads(decision_raw)
    except Exception as e:
        print(f"Error during synthesis: {e}")
        # Fallback dictionary in case JSON parsing fails
        decision = {
            "verdict": "Cautious Go",
            "confidence": "Medium",
            "strengths": ["Unbiased domain inputs", "Clear problem space identified"],
            "risks": [f"Synthesis parsing issue: {str(e)}", "Please check advisor logs below for details"],
            "action_items": ["Review individual advisor feedback tabs to extract recommendations"]
        }

    return {
        "council_decision": decision,
        "agent_analyses": agent_outputs_dict,
        "scores": agent_scores_dict
    }

@app.post("/evaluate/{agent_key}")
async def evaluate_agent(agent_key: str, request: IdeaRequest):
    try:
        prompt = load_prompt(f"{agent_key}.txt")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Agent not found")

    provider = request.provider or "gemini"
    client = get_client(provider)
    
    if provider == "gemini":
        model = request.model or "gemini-1.5-flash"
    elif provider == "openai":
        model = request.model or "gpt-4o-mini"
    else:
        model = request.model or "llama3"

    try:
        response = await client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": request.idea}
            ]
        )
        return {
            "agent": agent_key,
            "analysis": response.choices[0].message.content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Consilium backend is running"
    }
