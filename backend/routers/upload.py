from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
from models.database import get_db, UploadedFile
from utils.auth import get_current_user, oauth2_scheme
from utils.text_extractor import extract_text
import os, shutil

router = APIRouter(prefix="/upload", tags=["File Upload"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
):
    # Check file extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Use PDF, DOCX or TXT"
        )

    # Save file to disk
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    try:
        result = extract_text(file_path)
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=422, detail=f"Could not extract text: {str(e)}")

    # Save to database
    db_file = UploadedFile(
        filename=file.filename,
        file_path=file_path
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)

    return {
        "message": "File uploaded successfully",
        "file_id": db_file.id,
        "filename": file.filename,
        "total_paragraphs": result["total_paragraphs"],
        "paragraphs": result["paragraphs"]
    }

@router.get("/files")
def list_files(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    files = db.query(UploadedFile).all()
    return [{"id": f.id, "filename": f.filename, "uploaded_at": f.uploaded_at} for f in files]