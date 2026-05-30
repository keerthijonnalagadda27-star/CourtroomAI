from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base,engine
from models import user
from auth import router as auth_router

#idi mana fastapi app ni create chestundi ..ante like oka key engine start chestunnatu..it starts our app
app=FastAPI(
    title="CourtroomAI",
    description="AI-powered legal aid for every Indian",
    version="1.0.0"
)

# origins = the addresses we allow to talk to our backend
#Why 5173 specifically?
# That's the default port Vite uses — Vite is the tool that runs your React app locally. We haven't set it up yet but when we do, React will automatically start at 5173. So we're just preparing for that now.


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)

Base.metadata.create_all(bind=engine)
app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "app": "CourtroomAI",
        "message": "Legal aid for every Indian",
        "status": "running"
    }