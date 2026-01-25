# Consilium — Multi‑Agent AI Council

Consilium is a multi‑agent AI system that simulates founder‑level strategic discussions for evaluating entrepreneurial ideas. Independent, role‑based agents analyze an idea in parallel, and a Chairperson synthesizes their insights into a single, actionable council decision.

Status: Complete and demo-ready (local execution)
---

## Why Consilium

Most idea evaluators provide a single perspective. Consilium mirrors how real startup decisions are made — through multiple specialized viewpoints (product, market, tech, finance, risk, growth) and a final synthesis.

This project demonstrates:

- Multi‑agent system design
- Prompt orchestration and synthesis logic
- Backend API architecture using FastAPI
- Practical debugging and production‑safe file handling

---

## Architecture Overview

**Flow:**

1. User submits an idea
2. Seven independent agents evaluate the idea (role‑specific prompts)
3. Agent outputs are aggregated internally
4. Chairperson synthesizes a final verdict
5. API returns a single structured decision

```
User Idea
   ↓
[7 Role‑Based Agents]
   ↓
[Chairperson Synthesis]
   ↓
Final Council Decision
```

---

## Council Agents

| Agent                 | Responsibility                                 |
| --------------------- | ---------------------------------------------- |
| Visionary (CEO)       | Vision, mission alignment, strategic relevance |
| Product Lead          | Problem–solution fit, MVP scope                |
| Market Analyst        | Market demand, competition, positioning        |
| Technology Lead (CTO) | Technical feasibility and scalability          |
| Finance Advisor (CFO) | Revenue model, costs, sustainability           |
| Risk & Compliance     | Legal, operational, execution risks            |
| Strategy & Growth     | Go‑to‑market and scaling strategy              |

**Chairperson:** Synthesizes all agent outputs into a single recommendation without introducing new analysis.

---

## API Endpoints

### Health Check

```
GET /
```

Returns API status.

---

### Evaluate Single Agent

```
POST /evaluate/{agent_key}
```

Runs a specific agent by role.

**Example agent keys:**

- visionary
- product_lead
- market_analyst
- technology_lead
- finance_advisor
- risk_compliance
- strategy_growth

**Request Body:**

```json
{
  "idea": "Your startup idea here"
}
```

---

### Full Council Evaluation

```
POST /evaluate/council
```

Runs all agents sequentially and returns a synthesized council decision.

**Request Body:**

```json
{
  "idea": "An AI platform that helps college students find paid micro‑internships."
}
```

**Response (Example):**

```json
{
  "council_decision": "Council Verdict: Cautious Go..."
}
```

---

## Tech Stack

- **Backend:** Python, FastAPI
- **LLM:** OpenAI API (model‑agnostic design)
- **Configuration:** python‑dotenv
- **API Docs:** Swagger (OpenAPI)

---

## Project Structure

```
Consilium/
├── backend/
│   └── app.py
├── prompts/
│   ├── visionary.txt
│   ├── product_lead.txt
│   ├── market_analyst.txt
│   ├── technology_lead.txt
│   ├── finance_advisor.txt
│   ├── risk_compliance.txt
│   ├── strategy_growth.txt
│   └── chairperson.txt
├── README.md
└── PROJECT_CHARTER.md
```

---

## Running Locally

1. Clone the repository
2. Create a `.env` file inside `backend/`:

```
OPENAI_API_KEY=your_api_key_here
```

3. Install dependencies

```
pip install -r backend/requirements.txt
```

4. Start the server

```
python -m uvicorn backend.app:app
```

5. Open Swagger

```
http://127.0.0.1:8000/docs
```

---

## Key Learnings

- Multi‑agent orchestration patterns
- Safe prompt loading using absolute paths
- Debugging Python import caching issues
- Designing explainable AI systems

---

## Future Enhancements (Optional)

- Parallel agent execution
- Provider toggle (OpenAI / Gemini)
- Frontend UI for idea submission
- Persistent evaluation history

---

## Author

Designed and developed by **Arjun R**.

This project is intended to demonstrate entrepreneurship‑level system design and applied AI engineering.
