# Tech Indro - Enterprise RAG Microservice
# Powered by FastAPI + LangChain Core & Community
# Handles Ingestion, Vector/BM25 Retrieval, Prompt Augmentation, and Generation

import os
import json
import re
from pathlib import Path
from typing import List, Optional, Dict, Any

# FastAPI & Pydantic Framework Imports
from fastapi import FastAPI, HTTPException  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
import uvicorn  # type: ignore

# LangChain Core Imports
from langchain_core.prompts import ChatPromptTemplate  # type: ignore
from langchain_core.output_parsers import StrOutputParser  # type: ignore

# Environment variables
BASE_DIR = Path(__file__).resolve().parent
PORT = int(os.environ.get("RAG_PORT", 8000))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")

# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
    if not GEMINI_API_KEY:
        GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
    if not GROQ_API_KEY:
        GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
except Exception:
    pass

app = FastAPI(
    title="Tech Indro RAG Service",
    description="Enterprise Knowledge Retrieval & Augmented Generation powered by FastAPI and LangChain",
    version="2.0.0"
)

# Enable CORS for Express backend and web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# LANGCHAIN DOCUMENT INGESTION & RETRIEVER PIPELINE
# ============================================================================

class TechIndroLangChainRAG:
    def __init__(self):
        self.documents: List[Document] = []
        self.retriever: Optional[BM25Retriever] = None
        self.collections: List[str] = ['courses', 'shikshak_kids', 'interview_bank', 'ai_tools', 'platform_faq']
        self.is_ready: bool = False
        self.load_and_index()

    def load_and_index(self):
        print("[LangChain RAG] Ingesting documents across Tech Indro repositories...")
        docs: List[Document] = []

        # 1. Ingest Courses
        courses_file = BASE_DIR / "courses.json"
        if courses_file.exists():
            try:
                with open(courses_file, "r", encoding="utf-8") as f:
                    courses = json.load(f)
                    for c in courses:
                        modules = "; ".join([f"{m.get('title', '')}: {m.get('desc', '')}" for m in c.get("modules", [])])
                        perks = ", ".join(c.get("perks", []))
                        content = f"Course: {c.get('title')}. Instructor: {c.get('instructor', 'Tech Indro Faculty')}. Duration: {c.get('duration', 'Flexible')}. Description: {c.get('description', '')}. Syllabus & Modules: {modules}. Key Highlights: {perks}."
                        docs.append(Document(
                            page_content=content,
                            metadata={
                                "id": f"course_{c.get('id', '')}",
                                "title": c.get("title", ""),
                                "category": "Professional Tech Course",
                                "collection": "courses",
                                "source": "Tech Indro Course Catalog"
                            }
                        ))
            except Exception as e:
                print(f"[LangChain RAG] Error loading courses.json: {e}")

        # 2. Ingest Shikshak Kids Curriculum
        shikshak_file = BASE_DIR / "shikshak-courses.json"
        if shikshak_file.exists():
            try:
                with open(shikshak_file, "r", encoding="utf-8") as f:
                    shikshak = json.load(f)
                    for s in shikshak:
                        clean_desc = re.sub(r'<[^>]+>', ' ', s.get("description", ""))
                        perks = ", ".join(s.get("perks", []))
                        content = f"Shikshak Kids Course: {s.get('title')}. Category: {s.get('category', 'Kids Coding')}. Level: {s.get('level', 'Beginner')}. Duration: {s.get('duration', 'Flexible')}. Description: {clean_desc}. Highlights: {perks}. Primary Tool: {s.get('primaryLink', '')}."
                        docs.append(Document(
                            page_content=content,
                            metadata={
                                "id": f"shikshak_{s.get('id', '')}",
                                "title": f"Kids & AI: {s.get('title')}",
                                "category": s.get("category", "Kids Robotics & Coding"),
                                "collection": "shikshak_kids",
                                "source": "Tech Indro Shikshak Rohini Curriculum"
                            }
                        ))
            except Exception as e:
                print(f"[LangChain RAG] Error loading shikshak-courses.json: {e}")

        # 3. Ingest Interview & Assessment Bank
        questions_file = BASE_DIR / "questions.json"
        if questions_file.exists():
            try:
                with open(questions_file, "r", encoding="utf-8") as f:
                    questions = json.load(f)
                    for idx, q in enumerate(questions):
                        opts = " | ".join(q.get("options", []))
                        correct = q.get("correct")
                        if isinstance(correct, list):
                            correct_ans = ", ".join([q.get("options", [])[i] for i in correct if i < len(q.get("options", []))])
                        elif isinstance(correct, int) and q.get("options") and correct < len(q.get("options")):
                            correct_ans = q.get("options")[correct]
                        else:
                            correct_ans = str(correct)

                        content = f"Technical Assessment. Domain: {q.get('domain', 'Tech')}. Question: {q.get('question', '')}. Options: {opts}. Correct Answer: {correct_ans}."
                        docs.append(Document(
                            page_content=content,
                            metadata={
                                "id": f"question_{idx}",
                                "title": f"{q.get('domain', 'General')}: {q.get('question', '')[:65]}...",
                                "category": q.get("domain", "Interview Bank"),
                                "collection": "interview_bank",
                                "source": "Tech Indro Assessment Bank"
                            }
                        ))
            except Exception as e:
                print(f"[LangChain RAG] Error loading questions.json: {e}")

        # 4. Ingest AI Tools Directory
        ai_tools_file = BASE_DIR / "ai-tools.json"
        if ai_tools_file.exists():
            try:
                with open(ai_tools_file, "r", encoding="utf-8") as f:
                    ai_tools = json.load(f)
                    for idx, t in enumerate(ai_tools):
                        content = f"AI Tool: {t.get('name')}. Category: {t.get('category')}. Pricing: {t.get('pricing')}. Description: {t.get('description', '')}. Tags: {', '.join(t.get('tags', []))}. URL: {t.get('url', '')}."
                        docs.append(Document(
                            page_content=content,
                            metadata={
                                "id": f"tool_{idx}",
                                "title": f"AI Tool - {t.get('name')}",
                                "category": t.get("category", "AI Tool"),
                                "collection": "ai_tools",
                                "source": "Tech Indro AI Tools Hub"
                            }
                        ))
            except Exception as e:
                print(f"[LangChain RAG] Error loading ai-tools.json: {e}")

        # 5. Ingest Platform FAQs & Policies
        faqs = [
            {
                "title": "Tech Indro Summer of Code (TSOC)",
                "content": "Tech Indro Summer of Code (TSOC) is an intensive 8-week open-source engineering mentorship program. Students work with industry leads, contribute to production microservices, receive industry certificates, and earn stipends.",
                "category": "TSOC Program"
            },
            {
                "title": "AI Shikshak (Rohini) Voice & Learning Assistant",
                "content": "AI Shikshak Rohini is Tech Indro's dedicated multilingual tutor for kids and beginners. Rohini teaches Python, Robotics (Arduino, Raspberry Pi), Math, Scratch, and Web Dev with real code, speech synthesis in Hindi, English, and Bhojpuri, and step-by-step guidance.",
                "category": "Shikshak Platform"
            },
            {
                "title": "Tech Indro Verifiable AI Certificates",
                "content": "Every student completing a course or passing the technical capstone receives a cryptographically verifiable AI certificate with an AI Skill Score, unique credential ID, and tailored academic citation verifiable on the Tech Indro platform.",
                "category": "Certifications"
            },
            {
                "title": "ISRO Space Lab & Robotics Virtual Simulator",
                "content": "Tech Indro ISRO Lab features interactive telemetry simulators, orbital velocity calculators, satellite communication pipelines, and motor control robotics code designed for both students and space-tech enthusiasts.",
                "category": "Space & Robotics Lab"
            },
            {
                "title": "Refund and Admission Support",
                "content": "Tech Indro offers a transparent 7-day money-back refund guarantee on all bootcamps if the student is not completely satisfied. Support is accessible via support@techindro.com or WhatsApp student helpline.",
                "category": "Platform Policy"
            }
        ]

        for idx, faq in enumerate(faqs):
            docs.append(Document(
                page_content=faq["content"],
                metadata={
                    "id": f"faq_{idx}",
                    "title": faq["title"],
                    "category": faq["category"],
                    "collection": "platform_faq",
                    "source": "Tech Indro Official Knowledge & Policies"
                }
            ))

        self.documents = docs
        if docs:
            # Build LangChain BM25 Retriever
            self.retriever = BM25Retriever.from_documents(docs)
            self.retriever.k = 4
            self.is_ready = True
            print(f"[LangChain RAG] Successfully initialized: {len(docs)} documents indexed across {len(self.collections)} collections.")

    def search(self, query: str, max_results: int = 3, collection: Optional[str] = None, agent: str = "general") -> List[Dict[str, Any]]:
        if not self.is_ready or not self.retriever:
            return []

        # Adjust k dynamically
        self.retriever.k = max_results * 2
        retrieved_docs = self.retriever.invoke(query)

        results = []
        is_kids_query = agent == "kids" or bool(re.search(r'(kid|shikshak|rohini|bachha|robot|arduino|scratch|chota)', query, re.I))

        for doc in retrieved_docs:
            col = doc.metadata.get("collection")
            if collection and col != collection:
                continue

            # Prioritize kids collection if query is kids oriented
            priority = 1.0
            if is_kids_query and col == "shikshak_kids":
                priority = 1.5

            results.append({
                "id": doc.metadata.get("id"),
                "title": doc.metadata.get("title"),
                "category": doc.metadata.get("category"),
                "source": doc.metadata.get("source"),
                "collection": col,
                "content": doc.page_content,
                "priority": priority
            })

        results.sort(key=lambda x: x["priority"], reverse=True)
        return results[:max_results]

    def build_context_block(self, query: str, max_results: int = 3, agent: str = "general") -> Dict[str, Any]:
        matches = self.search(query, max_results=max_results, agent=agent)
        if not matches:
            return {"has_context": False, "context": "", "sources": []}

        sources = [{
            "id": m["id"],
            "title": m["title"],
            "category": m["category"],
            "source": m["source"]
        } for m in matches]

        context_lines = ["=== VERIFIED TECH INDRO KNOWLEDGE BASE (RETRIEVED VIA LANGCHAIN) ==="]
        for idx, m in enumerate(matches, 1):
            context_lines.append(f"[Source {idx}: {m['title']} | Category: {m['category']}]")
            context_lines.append(f"{m['content']}\n")
        context_lines.append("=== END RETRIEVED KNOWLEDGE BASE ===")

        return {
            "has_context": True,
            "context": "\n".join(context_lines),
            "sources": sources
        }

rag_engine = TechIndroLangChainRAG()

# ============================================================================
# API MODELS & SCHEMAS
# ============================================================================

class SearchRequest(BaseModel):
    query: str
    max_results: int = Field(default=3, alias="maxResults")
    agent: Optional[str] = "general"
    collection: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    lang: Optional[str] = "auto"
    agent: Optional[str] = "general"
    system_instruction: Optional[str] = Field(default=None, alias="systemInstruction")
    rag: Optional[bool] = True

# ============================================================================
# FASTAPI ROUTES
# ============================================================================

@app.get("/")
@app.get("/health")
@app.get("/api/rag/status")
def get_status():
    return {
        "status": "online" if rag_engine.is_ready else "initializing",
        "framework": "FastAPI + LangChain",
        "total_documents": len(rag_engine.documents),
        "collections": rag_engine.collections,
        "retriever_type": "LangChain BM25Retriever"
    }

@app.post("/api/rag/search")
def search_knowledge(payload: SearchRequest):
    if not payload.query or not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query is required")

    results = rag_engine.search(
        query=payload.query,
        max_results=payload.max_results,
        collection=payload.collection,
        agent=payload.agent or "general"
    )
    return {
        "query": payload.query,
        "total_matches": len(results),
        "results": results
    }

@app.post("/api/rag/chat")
async def rag_chat(payload: ChatRequest):
    if not payload.message or not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")

    # 1. Retrieve RAG Context using LangChain
    rag_data = {"has_context": False, "context": "", "sources": []}
    if payload.rag:
        rag_data = rag_engine.build_context_block(payload.message, max_results=3, agent=payload.agent or "general")

    # 2. Build Language & System Directives
    target_lang = (payload.lang or "auto").lower()
    is_bhojpuri = target_lang == "bho" or bool(re.search(r'(bhojpuri|bhojpuria|kaise hoi|kaise bani|kaise hot|kaise kari|ka ho|ka haal ba|humar|tohar|batawa|batava|kaha se|raua|baat suni|baate|chala|humni|sikha da|sikha di|dekhla|batav|kaise likhal|bhaiya)', payload.message, re.I))
    is_hindi = not is_bhojpuri and (
        target_lang == "hi" or target_lang == "auto" or
        bool(re.search(r'[\u0900-\u097F]', payload.message)) or
        bool(re.search(r'(karein|kaise|kya|hai|batayein|batao|chahiye|samjhao|sikhao|karu|samajh|didi|dost|naam|btao|bnao|kse|kre)', payload.message, re.I))
    )

    if is_bhojpuri:
        lang_directive = "LANGUAGE REQUIREMENT: BHOJPURI. Reply completely in clean, natural, respectful Bhojpuri without emojis."
    elif is_hindi and target_lang != "en":
        lang_directive = "LANGUAGE REQUIREMENT: CASUAL HINGLISH / HINDI. Respond in natural, clean, professional Hinglish without emojis."
    else:
        lang_directive = "LANGUAGE REQUIREMENT: CLEAN CONVERSATIONAL ENGLISH. Respond in clear, professional English without emojis."

    sys_inst = payload.system_instruction or f"""You are Tech Indro AI Senior Mentor and Architecture Engine.
CRITICAL RULES:
1. ZERO EMOJIS: Do not use any emojis, unicode smiles, or decorative symbols.
2. NO ASTERISK CLUTTER: Do not wrap every word in double asterisks (**) or use multiple hashes (###). Use plain text and standard clean formatting.
3. GROUNDING: If Tech Indro Knowledge Base context is provided below, strictly answer based on these official courses, robotics syllabi, and facts.
4. {lang_directive}"""

    if rag_data["has_context"]:
        sys_inst += f"\n\n{rag_data['context']}\nINSTRUCTION: Strictly ground your response in the verified facts from Tech Indro knowledge base above."

    # 3. Try LangChain Groq or Google GenAI
    # Groq Chain
    if GROQ_API_KEY and GROQ_API_KEY != "YOUR_GROQ_API_KEY":
        try:
            from langchain_groq import ChatGroq  # type: ignore
            llm = ChatGroq(model_name="llama-3.3-70b-versatile", groq_api_key=GROQ_API_KEY, temperature=0.6)  # type: ignore
            prompt = ChatPromptTemplate.from_messages([
                ("system", sys_inst),
                ("human", "{question}")
            ])
            chain = prompt | llm | StrOutputParser()
            response_text = await chain.ainvoke({"question": payload.message})
            clean_output = re.sub(r'[\U00010000-\U0010ffff]', '', response_text).replace('**', '').strip()
            return {
                "response": clean_output,
                "reply": clean_output,
                "provider": "langchain_groq",
                "ragSources": rag_data["sources"]
            }
        except Exception as e:
            print(f"[LangChain RAG] Groq error: {e}")

    # Gemini Chain
    if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY":
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI  # type: ignore
            llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=GEMINI_API_KEY, temperature=0.6)  # type: ignore
            prompt = ChatPromptTemplate.from_messages([
                ("system", sys_inst),
                ("human", "{question}")
            ])
            chain = prompt | llm | StrOutputParser()
            response_text = await chain.ainvoke({"question": payload.message})
            clean_output = re.sub(r'[\U00010000-\U0010ffff]', '', response_text).replace('**', '').strip()
            return {
                "response": clean_output,
                "reply": clean_output,
                "provider": "langchain_gemini",
                "ragSources": rag_data["sources"]
            }
        except Exception as e:
            print(f"[LangChain RAG] Gemini error: {e}")

    # Fallback response with retrieved RAG facts
    fallback_lines = []
    if rag_data["sources"]:
        top_src = rag_data["sources"][0]
        fallback_lines.append(f"Tech Indro Knowledge Grounded Answer: Based on {top_src['title']} ({top_src['category']}):")
    else:
        fallback_lines.append("Tech Indro RAG Knowledge Engine:")

    fallback_lines.append(f"Aapke sawal '{payload.message}' ke context me Tech Indro official curriculum aur knowledge bank se real facts retrieve kiye gaye hain.")
    return {
        "response": "\n\n".join(fallback_lines),
        "reply": "\n\n".join(fallback_lines),
        "provider": "langchain_fastapi_local",
        "ragSources": rag_data["sources"]
    }

if __name__ == "__main__":
    uvicorn.run("rag_service:app", host="0.0.0.0", port=PORT, reload=True)
