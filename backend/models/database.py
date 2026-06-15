from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Tables ---

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    files = relationship("UploadedFile", back_populates="owner")

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    file_path = Column(String)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="files")
    questions = relationship("Question", back_populates="source_file")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text)
    answer = Column(Text)
    difficulty = Column(String)
    question_type = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    file_id = Column(Integer, ForeignKey("uploaded_files.id"))
    source_file = relationship("UploadedFile", back_populates="questions")

# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create all tables
def init_db():
    Base.metadata.create_all(bind=engine)