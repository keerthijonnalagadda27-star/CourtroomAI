from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google.auth import default
from database import Base,engine
from models import user
from auth import router as auth_router
from routers.ask import router as ask_router
from routers.ask import ChatHistory
from fastapi.openapi.utils import get_openapi
#get_openapi is FastAPI's built-in function that generates the openapi JSON. 




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
app.include_router(ask_router)
@app.get("/")
def home():
    return {
        "app": "CourtroomAI",
        "message": "Legal aid for every Indian",
        "status": "running"
    }
     



#      Swagger UI reads something called an openapi_schema — it's basically a big JSON document that describes your entire API. Every endpoint, every request format, every response format. Swagger reads this JSON and draws the visual page you see.
# By default FastAPI generates this JSON automatically. But it doesn't include BearerAuth by default. So we're replacing the default generator with our own custom one that adds BearerAuth.