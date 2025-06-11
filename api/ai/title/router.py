from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .title_generator import generate_title

router = APIRouter()

# Veri modeli
class News(BaseModel):
    text: str  # Haber metni

def process_title(news_text):
    title = generate_title(news_text)
    return title

# API Endpoint: /ai/generate-title
@router.post("/generate-title")
def generate_title_endpoint(request: News):
    title = process_title(request.text)
    if not title:
        raise HTTPException(status_code=404, detail="Title generation failed")
    return {"title": title} 