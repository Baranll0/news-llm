from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .text_summarizer import summarize_text

router = APIRouter()

# Veri modeli
class News(BaseModel):
    text: str  # Haber metni

def process_summary(news_text):
    summary = summarize_text(news_text)
    return summary

# API Endpoint: /ai/summarize
@router.post("/summarize")
def generate_summary_endpoint(request: News):
    summary = process_summary(request.text)
    if not summary:
        raise HTTPException(status_code=404, detail="Summary generation failed")
    return {"summary": summary} 