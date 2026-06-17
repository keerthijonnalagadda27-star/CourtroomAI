# ⚖️ CourtroomAI — Legal Aid for Every Indian

> AI-powered legal assistant that helps Indian citizens understand their rights, get legal guidance, and generate legal notices — in English, Hindi, and Telugu.

🌐 **Live Demo:** [courtroomai.vercel.app](https://courtroomai.vercel.app)

---

## 🚀 Features

- 🤖 **AI Legal Q&A** — Ask any legal question, get answers grounded in actual Indian law (IPC, CrPC, RTI Act)
- 📄 **Legal Notice Generator** — Describe your situation, download a professionally drafted legal notice as PDF
- 🌍 **Multilingual** — Full support for English, Hindi (हिंदी), and Telugu (తెలుగు)
- 🎤 **Voice Input** — Speak your legal problem in your language
- 🔒 **Secure Auth** — JWT-based authentication with bcrypt password hashing
- 📊 **DSA Precedent Graph and tries** — BFS traversal of Indian court case citation network to find relevant precedents along with tries which help in finding the section numbers
- 💬 **Chat History** — All conversations saved and retrievable

---

## 🛠️ Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- i18next (multilingual)
- Web Speech API (voice input)
- Axios

### Backend
- FastAPI (Python)
- SQLAlchemy + SQLite
- JWT Authentication
- LangChain + ChromaDB (RAG pipeline)
- Groq API + Llama 3.3 70B
- ReportLab (PDF generation)
- DSA: Graph + BFS for legal precedents, Trie for IPC lookup

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 🧠 How the AI Works (RAG Pipeline)

1. Indian law PDFs (IPC, CrPC, RTI Act) are loaded and split into chunks
2. Each chunk is converted to a vector using SentenceTransformers
3. Vectors stored in ChromaDB vector database
4. User asks a question → question converted to vector → ChromaDB finds most similar law sections
5. Relevant sections + question sent to Llama 3.3 70B via Groq API
6. AI answers based on actual law — not hallucination

---

## 📊 DSA Implementation

**Precedent Graph (Graph + BFS)**
- Nodes = Indian court judgments
- Edges = citation relationships between cases
- BFS traversal finds most relevant supporting precedents for any legal question

---

## 🏃 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌟 Built By

Sree Keerthi- Incoming 3 rd year student
Built from scratch in 3 weeks 
