import pymupdf
from docx import Document
import re
import os

def extract_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file"""
    text = ""
    try:
        doc = pymupdf.open(file_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        raise ValueError(f"Could not read PDF: {str(e)}")
    return text

def extract_from_docx(file_path: str) -> str:
    """Extract text from a Word document"""
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text += paragraph.text + "\n"
    except Exception as e:
        raise ValueError(f"Could not read DOCX: {str(e)}")
    return text

def clean_text(text: str) -> str:
    """Clean extracted text"""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep punctuation
    text = re.sub(r'[^\w\s\.\,\!\?\;\:\-\(\)]', ' ', text)
    # Remove extra spaces
    text = text.strip()
    return text

def split_into_paragraphs(text: str, min_length: int = 100) -> list:
    """Split text into meaningful paragraphs"""
    # Split by newlines or double spaces
    chunks = re.split(r'\n\n|\r\n\r\n', text)
    
    paragraphs = []
    for chunk in chunks:
        chunk = chunk.strip()
        # Only keep chunks that are long enough to generate questions from
        if len(chunk) >= min_length:
            paragraphs.append(chunk)
    
    return paragraphs

def classify_difficulty(paragraph: str) -> str:
    """Classify paragraph difficulty based on length and complexity"""
    words = paragraph.split()
    avg_word_length = sum(len(w) for w in words) / len(words) if words else 0
    
    if len(words) < 50 and avg_word_length < 5:
        return "easy"
    elif len(words) < 100 and avg_word_length < 7:
        return "medium"
    else:
        return "hard"

def extract_text(file_path: str) -> dict:
    """Main function - extract and process text from any supported file"""
    
    # Check file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Get file extension
    ext = os.path.splitext(file_path)[1].lower()
    
    # Extract based on file type
    if ext == ".pdf":
        raw_text = extract_from_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        raw_text = extract_from_docx(file_path)
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as f:
            raw_text = f.read()
    else:
        raise ValueError(f"Unsupported file type: {ext}. Use PDF, DOCX, or TXT")
    
    # Clean the text
    cleaned = clean_text(raw_text)
    
    # Split into paragraphs
    paragraphs = split_into_paragraphs(cleaned)
    
    # Add difficulty to each paragraph
    result = []
    for i, para in enumerate(paragraphs):
        result.append({
            "id": i + 1,
            "text": para,
            "difficulty": classify_difficulty(para),
            "word_count": len(para.split())
        })
    
    return {
        "total_paragraphs": len(result),
        "paragraphs": result
    }