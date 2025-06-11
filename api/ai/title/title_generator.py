from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
import torch
import os

# WANDB'yi devre dışı bırak
os.environ["WANDB_DISABLED"] = "true"

# Model yolu
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "title_model")

print(f"Model yükleniyor: {MODEL_PATH}")

try:
    # Model ve tokenizer'ı yükle
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    
    # Model'i eval moduna al
    model.eval()
    
    # CUDA varsa kullan
    if torch.cuda.is_available():
        model = model.cuda()
        print("Model GPU'ya taşındı!")
    
    print("Model ve tokenizer başarıyla yüklendi!")
except Exception as e:
    print(f"Model yüklenirken hata: {e}")
    model = None
    tokenizer = None

def generate_title(text: str) -> str:
    try:
        if model is None or tokenizer is None:
            raise Exception("Model yüklenemedi")

        # Metni tokenize et
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            max_length=512,
            padding="max_length"
        )
        
        # Eğer GPU varsa inputları GPU'ya taşı
        if torch.cuda.is_available():
            inputs = {k: v.cuda() for k, v in inputs.items()}

        # Başlık üret
        with torch.no_grad():
            output_ids = model.generate(
                inputs["input_ids"],
                max_length=32,
                num_beams=4,
                early_stopping=True
            )

        # Başlığı decode et
        title = tokenizer.decode(output_ids[0], skip_special_tokens=True)
        return title

    except Exception as e:
        print(f"Başlık üretme hatası: {e}")
        return "" 