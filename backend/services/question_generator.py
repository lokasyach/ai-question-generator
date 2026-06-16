from transformers import T5Tokenizer, T5ForConditionalGeneration
import torch

# Load model once when the app starts (not on every request)
MODEL_NAME = "google/flan-t5-base"

print("Loading AI model... this may take a minute on first run.")
tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
model = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
print("Model loaded successfully!")

def generate_question(paragraph: str, difficulty: str = "medium") -> dict:
    """Generate a question and answer from a paragraph of text"""

    prompt = f"generate question: {paragraph}"

    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)

    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=64,
            num_beams=4,
            early_stopping=True
        )

    question = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Generate the answer using the same paragraph as context
    answer_prompt = f"question: {question} context: {paragraph}"
    answer_inputs = tokenizer(answer_prompt, return_tensors="pt", max_length=512, truncation=True)

    with torch.no_grad():
        answer_outputs = model.generate(
            **answer_inputs,
            max_length=64,
            num_beams=4,
            early_stopping=True
        )

    answer = tokenizer.decode(answer_outputs[0], skip_special_tokens=True)

    return {
        "question": question,
        "answer": answer,
        "difficulty": difficulty
    }

def generate_questions_from_paragraphs(paragraphs: list, max_questions: int = 5) -> list:
    """Generate questions from a list of paragraph dicts (from text_extractor)"""
    questions = []

    for para in paragraphs[:max_questions]:
        try:
            q = generate_question(para["text"], para["difficulty"])
            q["source_paragraph_id"] = para["id"]
            questions.append(q)
        except Exception as e:
            print(f"Error generating question for paragraph {para['id']}: {e}")
            continue

    return questions