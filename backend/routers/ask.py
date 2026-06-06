# 1 st use:- indulo mottam mana users adigina questions ni save chestam and their details also like id,user id, questions,answer,time of creation etc.
#2 nd use:- /ask endpoint ki post request vachina appudu, adi question ni database lo save chestadi and then RAG pipeline ni call chestadi to get the answer and then answer ni kuda database lo save chestadi with the question and user details.


import os

from fastapi import APIRouter,HTTPException,Depends,status

from fastapi.responses import Response

from sqlalchemy.orm import Session

from sqlalchemy import Column,String,Integer,DateTime,ForeignKey, Text

from sqlalchemy.sql import func
# func.now() — automatically saves current timestamp

from pydantic import BaseModel

from jose import JWTError,jwt

from database import Base,get_db


from dotenv import load_dotenv
load_dotenv()

#ippudu manam mana chathistory ni store cheyyadaniki database table create cheddam

class ChatHistory(Base):
    __tablename__="chat_history"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    # think of it like a reference — "this chat belongs to user number 3"
    # nullable=False means every chat must belong to a user

    question=Column(Text,nullable=False)

    answer=Column(Text,nullable=False)

    created_at=Column(DateTime(timezone=True),server_default=func.now())


class AskRequest(BaseModel):
    question:str
class AskResponse(BaseModel):
    question:str
    answer:str

    class Config:
        from_attributes=True
        # same as UserResponse — lets pydantic read SQLAlchemy objects adhe orm_mode=True ani kuda cheppachu but from_attributes=True is the new way in latest pydantic anthe..


#Before answering any question, we check — is this person actually logged in? We do that by reading their JWT token.

from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
security=HTTPBearer()

def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(security),db:Session=Depends(get_db)):           #reads the JWT token and finds the user in database
    credentials_exception=HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload=jwt.decode(
            credentials.credentials,
            os.getenv("SECRET_KEY"),
            algorithms=["HS256"]
            # payload is now a dictionary containing what we stored

        )
        email:str=payload.get("sub")   # "sub" is the field we stored the email in when creating token
        # payload.get("sub") reads that email out
        # if "sub" doesn't exist in payload, returns None

        if email is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    
    from models.user import User

    user=db.query(User).filter(User.email==email).first()

    if user is None:
        raise credentials_exception
    return user



router=APIRouter(prefix="/legal",tags=["Legal"])
# prefix="/legal" means every endpoint here starts with /legal
# so our endpoint will be /legal/ask

@router.post("/ask",response_model=AskResponse)

def ask_question(
    request:AskRequest,
    current_user=Depends(get_current_user),
    db:Session=Depends(get_db)
):
    try:
        from services.rag import answer_legal_question

        answer=answer_legal_question(request.question)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )
    

    chat=ChatHistory(
        user_id=current_user.id,
        question=request.question,
        answer=answer
    )
    db.add(chat)
    db.commit()
    db.refresh(chat)
    
     # reloads from database so we get the auto-filled id and created_at
    
    return chat

 # FastAPI uses AskResponse schema to format the response
    # sends back question and answer
    # user_id and created_at are not in AskResponse so they stay hidden



@router.post("/generate-notice")
def generate_notice(
    request: AskRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        from services.notice_generator import generate_legal_notice

        pdf_bytes = generate_legal_notice(request.question)

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                "attachment; filename=legal_notice.pdf"
            }
        )

    except Exception as e:
       print("NOTICE ERROR:", e)
       raise HTTPException(
        status_code=500,
        detail=str(e)
    )

    
  
# Content-Disposition tells browser to download the file
            # attachment means download, not open in browser
            # filename= sets the downloaded file's name