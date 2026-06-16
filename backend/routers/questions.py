from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, UploadedFile, Question
from utils.auth import oauth2_scheme
from utils.text_extractor import extract_text
from services.question_generator import generate_questions_from_paragraphs
from pydantic import BaseModel

router = APIRouter(prefix="/questions", tags=["Questions"])

class GenerateRequest(BaseModel):
    file_id: int
    max_questions: int = 5

@router.post("/generate")
def generate_questions(
    data: GenerateRequest,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    # Find the file
    db_file = db.query(UploadedFile).filter(UploadedFile.id == data.file_id).first()
    if not db_file:
        raise HTTPException(status_code=404, detail="File not found")

    # Re-extract text from the saved file
    result = extract_text(db_file.file_path)

    # Generate questions
    generated = generate_questions_from_paragraphs(
        result["paragraphs"],
        max_questions=data.max_questions
    )

    # Save questions to database
    saved_questions = []
    for q in generated:
        db_question = Question(
            question_text=q["question"],
            answer=q["answer"],
            difficulty=q["difficulty"],
            question_type="short_answer",
            file_id=db_file.id
        )
        db.add(db_question)
        db.commit()
        db.refresh(db_question)
        saved_questions.append({
            "id": db_question.id,
            "question": db_question.question_text,
            "answer": db_question.answer,
            "difficulty": db_question.difficulty
        })

    return {
        "file_id": db_file.id,
        "filename": db_file.filename,
        "total_questions": len(saved_questions),
        "questions": saved_questions
    }

@router.get("/file/{file_id}")
def get_questions_for_file(
    file_id: int,
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    questions = db.query(Question).filter(Question.file_id == file_id).all()
    return [
        {
            "id": q.id,
            "question": q.question_text,
            "answer": q.answer,
            "difficulty": q.difficulty
        }
        for q in questions
    ]