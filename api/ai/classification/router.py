from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .category_classifier import predict_category

router = APIRouter()

# Veri modeli
class News(BaseModel):
    text: str  # Haber metni

def process_category(news_text):
    category = predict_category(news_text)
    return category

# API Endpoint: /ai/classify
@router.post("/classify")
def predict_category_endpoint(request: News):
    category = process_category(request.text)
    if not category:
        raise HTTPException(status_code=404, detail="Category prediction failed")
    return {"category": category} 