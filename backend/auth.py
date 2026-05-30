from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime,timedelta
from database import get_db
from models.user import User
from schemas import UserSignup,UserLogin,UserResponse,Token
import os
from dotenv import load_dotenv
load_dotenv()


router=APIRouter(prefix="/auth",tags=["auth"])
# deprecated="auto" means old hash formats get updated automatically

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")
SECRET_KEY=os.getenv("SECRET_KEY")

algorithm="HS256"
# HS256 is the mathematical algorithm used to sign the token
# it stands for HMAC with SHA-256 — a standard secure algorithm

TOKEN_EXPIRE_DAYS=7

def hash_password(password:str)->str:
    return pwd_context.hash(password)
def verify_password(plain_password:str,hashed_password:str)->bool:
    return pwd_context.verify(plain_password,hashed_password)
def create_token(data:dict)->str:
    to_encode=data.copy()
    expire=datetime.utcnow()+timedelta(days=TOKEN_EXPIRE_DAYS)

    to_encode.update({"exp":expire})

    token=jwt.encode(to_encode,SECRET_KEY,algorithm=algorithm)
    return token
@router.post("/signup",response_model=UserResponse)
def signup(user_data:UserSignup,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.email==user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,detail="Email already registered") 
    hashed_password=hash_password(user_data.password)
    new_user=User(full_name=user_data.full_name,email=user_data.email,hashed_password=hashed_password)


    db.add(new_user)
    db.commit()
    db.refresh(new_user)   # db.refresh() reloads the user from database so we get the auto-filled fields like id and created_at that the database just generated

    return new_user
@router.post("/login",response_model=Token)

# this endpoint accepts POST requests at /auth/login
# response_model=Token means we send back a JWT token on success

def login(user_data:UserLogin, db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==user_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    if not verify_password(user_data.password,user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    token=create_token({"sub":user.email})

    return{
        "access_token" :token,
        "token_type":"bearer"  
    }

