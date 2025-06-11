import pandas as pd
from transformers import BertTokenizer, BertForSequenceClassification
import torch
import re
import os

# Veriyi temizleme fonksiyonu
def temizle(text):
    text = re.sub(r"[!'\n]", " ", text)  # Özel karakterleri kaldır
    text = re.sub(r"\s+", " ", text)     # Fazla boşlukları kaldır
    return text.strip().lower()          # Trim ve küçük harfe çevir

# Modeli ve tokenizer'ı yükleme
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(os.path.dirname(current_dir), "models", "category-classification")

print(f"Model yükleniyor: {model_dir}")  # Debug için yol bilgisi

# Model dizininin varlığını kontrol et
if not os.path.exists(model_dir):
    raise FileNotFoundError(f"Model dizini bulunamadı: {model_dir}")

# Gerekli model dosyalarının varlığını kontrol et
required_files = ['config.json', 'model.safetensors', 'special_tokens_map.json', 'tokenizer_config.json', 'vocab.txt']
missing_files = [f for f in required_files if not os.path.exists(os.path.join(model_dir, f))]
if missing_files:
    raise FileNotFoundError(f"Eksik model dosyaları: {', '.join(missing_files)}")

try:
    model = BertForSequenceClassification.from_pretrained(model_dir, use_safetensors=True)
    tokenizer = BertTokenizer.from_pretrained(model_dir)
    print("Model ve tokenizer başarıyla yüklendi!")
except Exception as e:
    print(f"Model yükleme hatası: {str(e)}")
    raise

# Kategori isimlerini eşleme
kategori_mapping = {
    "dunya": "Dünya",
    "ekonomi": "Ekonomi",
    "genel": "Genel",
    "guncel": "Güncel",
    "kultur-sanat": "Kültür ve Sanat",
    "magazin": "Magazin",
    "planet": "Gezegen",
    "saglik": "Sağlık",
    "spor": "Spor",
    "teknoloji": "Teknoloji",
    "turkiye": "Türkiye",
    "yasam": "Yaşam"
}

class_names = list(kategori_mapping.keys())  # Orijinal sınıf isimleri

def predict_category(text):
    # Metni temizleme
    cleaned_text = temizle(text)
    
    # Tokenizasyon
    inputs = tokenizer(cleaned_text, truncation=True, padding=True, max_length=512, return_tensors="pt")

    # Modelin tahmin yapması
    model.eval()
    with torch.no_grad():
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=1).item()

    # Tahmin edilen kategori
    predicted_class = class_names[prediction]
    predicted_category = kategori_mapping.get(predicted_class, "Bilinmeyen Kategori")

    return predicted_category 