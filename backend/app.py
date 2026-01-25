from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = FastAPI(
    title="Consilium API",
    version="0.1.0"
)

class IdeaRequest(BaseModel):
    idea: str

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROMPTS_DIR = os.path.join(BASE_DIR, "..", "prompts")

def load_prompt(filename: str) -> str:
    prompt_path = os.path.join(PROMPTS_DIR, filename)

    if not os.path.exists(prompt_path):
        raise FileNotFoundError(f"Prompt not found: {prompt_path}")

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()


@app.post("/evaluate/council")
def evaluate_council(request: IdeaRequest):
    agents = [
        "visionary",
        "product_lead",
        "market_analyst",
        "technology_lead",
        "finance_advisor",
        "risk_compliance",
        "strategy_growth"
    ]

    agent_outputs = []

    # 1. Sequential execution of all agents
    for agent_key in agents:
        try:
            prompt = load_prompt(f"{agent_key}.txt")
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": request.idea}
                ]
            )
            analysis = response.choices[0].message.content
            agent_outputs.append(f"--- {agent_key.replace('_', ' ').title()} ---\n{analysis}\n")
        except Exception as e:
            print(f"Error executing agent {agent_key}: {e}")
            agent_outputs.append(f"--- {agent_key} ---\n[Error executing agent]\n")

    # 2. Aggregation
    aggregated_reports = "\n".join(agent_outputs)

    # 3. Chairperson Synthesis
    chairperson_prompt = load_prompt("chairperson.txt")
    final_prompt = f"""
    Original Idea: {request.idea}

    Agent Reports:
    {aggregated_reports}

    Based on the above reports, provide the final council decision.
    """

    final_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": chairperson_prompt},
            {"role": "user", "content": final_prompt}
        ]
    )

    return {
        "council_decision": final_response.choices[0].message.content
    }

@app.post("/evaluate/{agent_key}")
def evaluate_agent(agent_key: str, request: IdeaRequest):
    try:
        prompt = load_prompt(f"{agent_key}.txt")
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Agent not found")

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": request.idea}
        ]
    )

    return {
        "agent": agent_key,
        "analysis": response.choices[0].message.content
    }

@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Consilium backend is running"
    }
