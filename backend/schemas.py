from pydantic import BaseModel,EmailStr

class UserSignup(BaseModel):
    full_name:str
    email:EmailStr
    password:str
class UserLogin(BaseModel):
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    id:int
    full_name:str
    email:str
    is_active:bool
    class Config:
        from_attributes=True;   #orm mode true set chesthe pydantic will be able to check anamata (just name maarchalsochindi tarvata..but same functioning)
class Token(BaseModel):
    access_token:str
    token_type:str


    
    # this defines what we send back when login is successful
    # access_token is the JWT token the user will use for future requests
    # token_type is always "bearer" — that's the standard name for JWT tokens








