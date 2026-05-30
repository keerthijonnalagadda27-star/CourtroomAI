from sqlalchemy import Column,Integer,String,Boolean,DateTime
from sqlalchemy.sql import func


# func gives us helper functions that the database understands
# we use func.now() to automatically save the current time

from database import Base
class User(Base):
    __tablename__="users"
    id=Column(Integer,primary_key=True,index=True)
    full_name=Column(String,nullable=False)
    email=Column(String,unique=True,index=True,nullable=False)
    hashed_password=Column(String,nullable=False)

    is_active=Column(Boolean,default=True)
    # this tracks if the user's account is active or banned

    created_at=Column(DateTime(timezone=True),server_default=func.now())
