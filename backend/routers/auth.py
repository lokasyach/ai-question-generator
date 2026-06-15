from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models.database import get_db, User
from utils.auth import hash_password, verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Authentication"])

# --- Schemas ---
class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

# --- Register ---
@router.post("/register", status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"message": "Account created successfully", "username": user.username}

# --- Login ---
@router.post("/login", response_model=TokenResponse)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form.username).first()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}