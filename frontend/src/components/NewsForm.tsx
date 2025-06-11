import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Chip,
  IconButton,
  Divider,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormGroup,
  Checkbox,
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  PhotoCamera, 
  Save, 
  Cancel, 
  SmartToy, 
  AutoAwesome,
  Category as CategoryIcon,
  ArrowForward,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NewsFormData, NewsPosition } from '../types/News';
import api from '../services/api';

const Input = styled('input')({
  display: 'none',
});

// Quill modülleri ve formatları
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['clean']
  ],
};

const quillFormats = [
  'header',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet'
];

const POSITIONS: { value: NewsPosition; label: string }[] = [
  { value: 'manset', label: 'Manşet' },
  { value: 'yan_manset', label: 'Yan Manşet' },
  { value: 'son_dakika', label: 'Son Dakika' },
  { value: 'normal', label: 'Normal Haber' },
];

interface NewsFormProps {
  initialData?: NewsFormData;
  onSubmit: (data: NewsFormData) => void;
  onCancel: () => void;
}

const categories = [
  { value: 'dunya', label: 'Dünya' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: 'genel', label: 'Genel' },
  { value: 'guncel', label: 'Güncel' },
  { value: 'kultur-sanat', label: 'Kültür-Sanat' },
  { value: 'magazin', label: 'Magazin' },
  { value: 'planet', label: 'Planet' },
  { value: 'saglik', label: 'Sağlık' },
  { value: 'spor', label: 'Spor' },
  { value: 'turkiye', label: 'Türkiye' },
  { value: 'teknoloji', label: 'Teknoloji' },
  { value: 'yasam', label: 'Yaşam' }
];

const NewsForm: React.FC<NewsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<NewsFormData>({
    title: initialData?.title || '',
    spot: initialData?.spot || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    summary: initialData?.summary || '',
    positions: initialData?.positions || ['normal'],
    imageUrl: initialData?.imageUrl || '',
    image: undefined
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isPredictingCategory, setIsPredictingCategory] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        spot: initialData.spot || '',
        content: initialData.content || '',
        category: initialData.category || '',
        summary: initialData.summary || '',
        positions: initialData.positions || ['normal'],
        imageUrl: initialData.imageUrl || '',
        image: undefined
      });
      // Eğer imageUrl varsa, onu önizleme olarak göster
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl.startsWith('http') ? 
          initialData.imageUrl 
          : `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/${initialData.imageUrl}`
        );
      }
    }
  }, [initialData]);

  const handleChange = (field: string) => (event: any) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const handleEditorChange = (content: string) => {
    setFormData({ ...formData, content });
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        // Önce resmi yükle
        const imageUrl = await api.uploadImage(file);
        if (imageUrl) {
          // Önizleme için dosyayı oku
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
          
          // Form verisini güncelle
          setFormData(prev => ({
            ...prev,
            imageUrl: imageUrl,
            image: imageUrl
          }));
        }
      } catch (error) {
        console.error('Resim yükleme hatası:', error);
        alert('Resim yüklenirken bir hata oluştu!');
      }
    }
  };

  const handlePredictCategory = async () => {
    try {
      setIsPredictingCategory(true);
      const aiServiceUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${aiServiceUrl}/ai/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: formData.content + "\n" + formData.title + "\n" + formData.spot
        }),
      });

      if (!response.ok) {
        throw new Error('Kategori tahmin edilirken bir hata oluştu');
      }

      const result = await response.json();
      if (result.category) {
        // Tahmin edilen kategoriyi küçük harfe çevir ve tire/boşluk karakterlerini düzelt
        const predictedCategory = result.category.toLowerCase()
          .replace(/\s+/g, '-')  // boşlukları tire ile değiştir
          .replace(/ı/g, 'i')    // Türkçe karakterleri düzelt
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c');

        // Tahmin edilen kategori mevcut kategorilerden biriyle eşleşiyor mu kontrol et
        const matchingCategory = categories.find(cat => 
          cat.value === predictedCategory || 
          cat.value.replace(/-/g, '') === predictedCategory.replace(/-/g, '')
        );

        if (matchingCategory) {
          setFormData(prev => ({ ...prev, category: matchingCategory.value }));
        } else {
          console.warn('Tahmin edilen kategori mevcut kategorilerle eşleşmiyor:', predictedCategory);
          // Varsayılan olarak 'guncel' kategorisini seç
          setFormData(prev => ({ ...prev, category: 'guncel' }));
        }
      } else {
        throw new Error('Kategori tahmini alınamadı');
      }
    } catch (error) {
      console.error('Kategori tahmin hatası:', error);
      alert('Kategori tahmin edilirken bir hata oluştu');
    } finally {
      setIsPredictingCategory(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const aiServiceUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${aiServiceUrl}/ai/summarize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: formData.content }),
      });

      if (!response.ok) {
        throw new Error('Özet oluşturulurken bir hata oluştu');
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, summary: result.summary }));
    } catch (error) {
      console.error('Özet oluşturma hatası:', error);
      alert('Özet oluşturulurken bir hata oluştu');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleGenerateTitle = async () => {
    try {
      setIsGeneratingTitle(true);
      const aiServiceUrl = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:8000';
      const response = await fetch(`${aiServiceUrl}/ai/generate-title`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: formData.content }),
      });

      if (!response.ok) {
        throw new Error('Başlık oluşturulurken bir hata oluştu');
      }

      const result = await response.json();
      setFormData(prev => ({ ...prev, title: result.title }));
    } catch (error) {
      console.error('Başlık oluşturma hatası:', error);
      alert('Başlık oluşturulurken bir hata oluştu');
    } finally {
      setIsGeneratingTitle(false);
    }
  };

  const handleTransferSummary = () => {
    if (formData.summary) {
      setFormData(prev => ({ ...prev, spot: formData.summary }));
    }
  };

  const handlePositionChange = (position: NewsPosition) => {
    setFormData(prev => {
      const newPositions = prev.positions.includes(position)
        ? prev.positions.filter(p => p !== position)
        : [...prev.positions, position];

      // Son dakika her zaman seçilebilir, diğerleri exclusive
      if (position !== 'son_dakika') {
        return {
          ...prev,
          positions: newPositions
        };
      }

      return {
        ...prev,
        positions: newPositions
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Backend'e gönderilecek veriyi hazırla
    const submitData = {
      ...formData,
      image: formData.imageUrl || '', // imageUrl'i image olarak gönder
      status: 'ACTIVE' // Varsayılan status ekle
    };
    
    onSubmit(submitData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 1200, margin: 'auto', mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5">
              {initialData ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
            </Typography>
            <SmartToy sx={{ color: 'primary.main', fontSize: 32 }} />
          </Grid>

          <Grid item xs={12} md={8}>
            {/* Sol Taraf - Ana İçerik */}
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    fullWidth
                    label="Haber Başlığı"
                    value={formData.title}
                    onChange={handleChange('title')}
                    required
                  />
                  <Button
                    variant="contained"
                    onClick={handleGenerateTitle}
                    disabled={!formData.content || isGeneratingTitle}
                    startIcon={<AutoAwesome />}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Başlık Oluştur
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Haber Spotu"
                  value={formData.spot}
                  onChange={handleChange('spot')}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Haber İçeriği
                </Typography>
                <Box sx={{ '.ql-container': { minHeight: '300px' } }}>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleEditorChange}
                    modules={quillModules}
                    formats={quillFormats}
                  />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <label htmlFor="icon-button-file">
                    <Input
                      accept="image/*"
                      id="icon-button-file"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                    >
                      Resim Yükle
                    </Button>
                  </label>
                  {imagePreview && (
                    <Box sx={{ mt: 2, position: 'relative' }}>
                      <img
                        src={imagePreview}
                        alt="Önizleme"
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          objectFit: 'contain',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '4px'
                        }}
                      />
                      <IconButton
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -10,
                          right: -10,
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onClick={() => {
                          setImagePreview(null);
                          setFormData(prev => ({ ...prev, image: undefined, imageUrl: '' }));
                        }}
                      >
                        <Cancel fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <FormControl component="fieldset" sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Haber Konumu
                  </Typography>
                  <FormGroup>
                    {POSITIONS.map((pos) => (
                      <FormControlLabel
                        key={pos.value}
                        control={
                          <Checkbox
                            checked={formData.positions.includes(pos.value)}
                            onChange={() => handlePositionChange(pos.value)}
                            disabled={
                              (pos.value !== 'son_dakika' && 
                               formData.positions.includes('manset') && 
                               pos.value !== 'manset') || 
                              (pos.value !== 'son_dakika' && 
                               formData.positions.includes('yan_manset') && 
                               pos.value !== 'yan_manset')
                            }
                          />
                        }
                        label={pos.label}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            {/* Sağ Taraf - AI Özellikleri */}
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesome color="primary" />
                AI Özellikleri
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon fontSize="small" />
                    Kategori Tahmini
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handlePredictCategory}
                    disabled={!formData.content || isPredictingCategory}
                    startIcon={<AutoAwesome />}
                    size="small"
                  >
                    Kategori Tahmin Et
                  </Button>
                </Box>
                <FormControl fullWidth>
                  <Select
                    value={formData.category}
                    onChange={handleChange('category')}
                    displayEmpty
                    size="small"
                  >
                    <MenuItem value="" disabled>
                      <em>Kategori Seçin</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle2">
                    AI Haber Özeti
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleGenerateSummary}
                    disabled={!formData.content || isGeneratingSummary}
                    startIcon={<AutoAwesome />}
                  >
                    Özet Oluştur
                  </Button>
                </Box>
                {formData.summary && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Oluşturulan Özet:
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 1.5, mb: 2, bgcolor: 'background.default' }}>
                      <Typography variant="body2">{formData.summary}</Typography>
                    </Paper>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="small"
                      onClick={handleTransferSummary}
                      startIcon={<ArrowForward />}
                    >
                      Spota Aktar
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<Cancel />}
                onClick={onCancel}
              >
                İptal
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<Save />}
              >
                Kaydet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default NewsForm; 