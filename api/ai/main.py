from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from classification.router import router as classification_router
from summarization.router import router as summarization_router
from title.router import router as title_router

# FastAPI uygulaması oluştur
app = FastAPI()

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm originlere izin ver (geliştirme için)
    allow_credentials=True,
    allow_methods=["*"],  # Tüm HTTP metodlarına izin ver
    allow_headers=["*"],  # Tüm başlıklara izin ver
)

# Router'ları ekle
app.include_router(classification_router, prefix="/ai")
app.include_router(summarization_router, prefix="/ai")
app.include_router(title_router, prefix="/ai")

@app.get("/")
async def root():
    return {"message": "AI API is running"} 