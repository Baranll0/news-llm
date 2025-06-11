from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import re
import os

# Veriyi temizleme fonksiyonu
def temizle(text):
    text = re.sub(r"[!'\n]", " ", text)  # Özel karakterleri kaldır
    text = re.sub(r"\s+", " ", text)     # Fazla boşlukları kaldır
    return text.strip()                  # Trim

# Modeli ve tokenizer'ı yükleme
current_dir = os.path.dirname(os.path.abspath(__file__))
model_dir = os.path.join(os.path.dirname(current_dir), "models", "text-summarization")

print(f"Model yükleniyor: {model_dir}")  # Debug için yol bilgisi

# Model dizininin varlığını kontrol et
if not os.path.exists(model_dir):
    raise FileNotFoundError(f"Model dizini bulunamadı: {model_dir}")

# Dosyaları listele
print("Mevcut dosyalar:", os.listdir(model_dir))

try:
    print("Tokenizer yükleniyor...")
    tokenizer = AutoTokenizer.from_pretrained(model_dir, use_fast=False)
    print("Tokenizer başarıyla yüklendi!")
    
    print("Model yükleniyor...")
    model = AutoModelForSeq2SeqLM.from_pretrained(model_dir)
    print("Model başarıyla yüklendi!")
except Exception as e:
    print(f"Model yükleme hatası: {str(e)}")
    raise

def summarize_text(text):
    try:
        # Metni temizle
        cleaned_text = temizle(text)
        print(f"Temizlenmiş metin: {cleaned_text}")
        
        # Tokenizasyon
        inputs = tokenizer(
            "summarization: " + cleaned_text,
            max_length=768,
            truncation=True,
            return_tensors="pt"
        )
        print("Tokenizasyon tamamlandı")

        # Modelin özet oluşturması
        model.eval()
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                max_length=256,
                min_length=50,
                top_k=50,  # Sampling boyutu
                top_p=0.95,  # Olasılıksal çekirdek
                num_return_sequences=1,
                do_sample=True,  # Sampling'i etkinleştirir
            )
            print("Model çıktısı oluşturuldu")
            
        # Özeti decode et
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        print(f"Oluşturulan özet: {summary}")
        
        return summary
    except Exception as e:
        print(f"Özetleme hatası: {str(e)}")
        raise 