import fitz
# fitz is the name of the pymupdf library when you import it

import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from groq import Groq

from dotenv import load_dotenv
load_dotenv()
# load our .env file to get the GEMINI_API_KEY chala important endukante mana ahh key git ki upload cheyyakudadhu security kosam


def load_pdfs(data_folder:str)->str:
    all_text=""
    for filename in os.listdir(data_folder):
        if filename.endswith(".pdf"):
            file_path = os.path.join(data_folder, filename)
            doc = fitz.open(file_path)

            print(f"Reading {filename}...")
            for page in doc:     # doc is a list of pages — we loop through each page
                all_text+=page.get_text()


            doc.close()
    print(f"Total characters read: {len(all_text)}")
    return all_text


def split_into_chunks(text:str)->list:
    splitter=RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=50
    )
    chunks=splitter.split_text(text)

    print(f"Total chunks created:{len(chunks)}")
    return chunks

def create_vector_store(chunks:list)->Chroma:
    # this function converts chunks to vectors and stores in ChromaDB
    # returns the Chroma database object so we can search it later

    print("Creating embeddings and storing in ChromaDB...")

    embeddings=HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"

        # this is a free, small, fast embedding model
        # "all-MiniLM-L6-v2" is its name on HuggingFace
        # it converts text to 384-dimensional vectors
        # first time it downloads automatically (~80MB)
    )

    vector_store=Chroma.from_texts(
        texts=chunks,
        embedding=embeddings,
        persist_directory="./chroma_db" 
        
        # "./chroma_db" means a folder called chroma_db 
    )
    print("Vector store created successfully!")
    return vector_store
def load_vector_store()->Chroma:
    # this function loads an already-built ChromaDB from disk

    embeddings=HuggingFaceEmbeddings(
        model_name="all-MiniLM-L6-v2"
    )
    vector_store=Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )
    return vector_store

def search_law(query:str,vector_store:Chroma)->str:
    results=vector_store.similarity_search(
        query=query,
         # the user's question — converted to vector and compared
        k=4
    )
    context="\n\n---\n\n".join([doc.page_content for doc in results])
    return context

def ask_gemini(question:str,context:str)->str:

    prompt = f"""You are CourtroomAI, a helpful legal assistant for Indian citizens.
You help people understand their legal rights in simple, clear language.
Always be helpful, accurate, and compassionate.

Here are the relevant sections from Indian law:

{context}

Based on these law sections, please answer this question clearly:
{question}

Give a practical, step-by-step answer that a common person can understand.
Mention the specific law sections that apply.

End with:
📖 RTI Act 2005 (Updated)
📖 IPC Act
"Note: This is legal information, not legal advice.
For serious matters, please consult a qualified lawyer."
"""

    client=Groq(api_key=os.getenv("GROQ_API_KEY"))
    response=client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )
    
    return response.choices[0].message.content


def answer_legal_question(question: str) -> str:
    try:
        if os.path.exists("./chroma_db"):
            print("Loading existing vector store...")
            vector_store = load_vector_store()
        else:
            print("Building vector store for the first time...")
            data_folder = os.path.join(os.path.dirname(__file__), "../data")

            if not os.path.exists(data_folder):
                raise Exception(f"Data folder not found: {data_folder}")

            pdf_files = [f for f in os.listdir(data_folder) if f.endswith('.pdf')]
            if not pdf_files:
                raise Exception(f"No PDF files found in {data_folder}")

            print(f"Found PDFs: {pdf_files}")
            text = load_pdfs(data_folder)
            chunks = split_into_chunks(text)
            vector_store = create_vector_store(chunks)

        print(f"Searching for: {question}")
        context = search_law(question, vector_store)
        print("Asking Groq...")
        answer = ask_gemini(question, context)
        return answer

    except Exception as e:
        print(f"RAG Error: {str(e)}")
        print("Falling back to direct Groq...")
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        prompt = f"""You are CourtroomAI, a helpful legal assistant for Indian citizens.
Answer this legal question using your knowledge of Indian law (IPC, CrPC, RTI Act, Consumer Protection Act):

{question}

Give a practical step-by-step answer. Mention specific law sections that apply.
End with: "Note: This is legal information, not legal advice. For serious matters, please consult a qualified lawyer."
"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content
