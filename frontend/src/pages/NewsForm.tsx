import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Checkbox,
    FormGroup,
    FormControlLabel,
    CircularProgress,
    IconButton,
    Tooltip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { News, NewsFormData, NewsPosition } from '../types/News';
import api from '../services/api';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SummarizeIcon from '@mui/icons-material/Summarize';
import CategoryIcon from '@mui/icons-material/Category';

const CATEGORIES = ['Spor', 'Ekonomi', 'Teknoloji', 'Siyaset', 'Sağlık', 'Eğitim', 'Yaşam', 'Kültür-Sanat', 'Magazin', 'Dünya', 'Genel', 'Güncel', 'Planet', 'Türkiye'];

const POSITIONS: { value: NewsPosition; label: string }[] = [
    { value: 'manset', label: 'Manşet' },
    { value: 'yan_manset', label: 'Yan Manşet' },
    { value: 'son_dakika', label: 'Son Dakika' },
    { value: 'alt_manset', label: 'Alt Manşet' },
    { value: 'normal', label: 'Normal' }
];

const NewsForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [news, setNews] = useState<NewsFormData>({
        title: '',
        spot: '',
        content: '',
        category: '',
        positions: ['normal'],
        summary: ''
    });
    const [aiLoading, setAiLoading] = useState({
        title: false,
        summary: false,
        category: false
    });

    useEffect(() => {
        if (id) {
            fetchNews();
        }
    }, [id]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const data = await api.getNewsById(id!);
            if (data) {
                setNews({
                    title: data.title,
                    spot: data.spot || '',
                    content: data.content || '',
                    category: data.category,
                    positions: data.positions,
                    summary: data.summary || '',
                    imageUrl: data.imageUrl
                });
            }
        } catch (error) {
            console.error('Haber yüklenirken hata oluştu:', error);
            alert('Haber yüklenirken bir hata oluştu!');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNews(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = (e: any) => {
        setNews(prev => ({
            ...prev,
            category: e.target.value
        }));
    };

    const handlePositionChange = (position: NewsPosition) => {
        setNews(prev => {
            const positions = prev.positions || [];
            const newPositions = positions.includes(position)
                ? positions.filter(p => p !== position)
                : [...positions, position];
            return {
                ...prev,
                positions: newPositions
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!news.title || !news.spot || !news.content || !news.category) {
                alert('Lütfen tüm zorunlu alanları doldurun!');
                return;
            }

            const newsData: NewsFormData = {
                title: news.title || '',
                spot: news.spot || '',
                content: news.content || '',
                category: news.category || '',
                summary: news.summary || '',
                positions: news.positions || ['normal']
            };

            if (id) {
                await api.updateNews(id, newsData);
                alert('Haber başarıyla güncellendi!');
            } else {
                await api.createNews(newsData);
                alert('Haber başarıyla eklendi!');
            }
            
            navigate('/admin');
        } catch (error) {
            console.error('Haber kaydedilirken hata:', error);
            alert('Haber kaydedilirken bir hata oluştu!');
        }
    };

    const handleGenerateTitle = async () => {
        try {
            if (!news.content) return;
            setAiLoading(prev => ({ ...prev, title: true }));
            const response = await api.generateTitle(news.content);
            setNews(prev => ({ ...prev, title: response.title }));
        } catch (error) {
            console.error('Başlık üretilirken hata:', error);
            alert('Başlık üretilirken bir hata oluştu!');
        } finally {
            setAiLoading(prev => ({ ...prev, title: false }));
        }
    };

    const handleGenerateSummary = async () => {
        try {
            if (!news.content) return;
            setAiLoading(prev => ({ ...prev, summary: true }));
            const response = await api.generateSummary(news.content);
            setNews(prev => ({ ...prev, summary: response.summary }));
        } catch (error) {
            console.error('Özet üretilirken hata:', error);
            alert('Özet üretilirken bir hata oluştu!');
        } finally {
            setAiLoading(prev => ({ ...prev, summary: false }));
        }
    };

    const handlePredictCategory = async () => {
        try {
            if (!news.content) return;
            setAiLoading(prev => ({ ...prev, category: true }));
            const response = await api.predictCategory(news.content);
            setNews(prev => ({ ...prev, category: response.category }));
        } catch (error) {
            console.error('Kategori tahmin edilirken hata:', error);
            alert('Kategori tahmin edilirken bir hata oluştu!');
        } finally {
            setAiLoading(prev => ({ ...prev, category: false }));
        }
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {id ? 'Haberi Düzenle' : 'Yeni Haber Ekle'}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Başlık"
                                    name="title"
                                    value={news.title}
                                    onChange={handleChange}
                                    required
                                />
                                <Tooltip title="AI ile Başlık Oluştur">
                                    <IconButton 
                                        onClick={handleGenerateTitle}
                                        disabled={aiLoading.title || !news.content}
                                    >
                                        {aiLoading.title ? <CircularProgress size={24} /> : <AutoFixHighIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Haber Spotu"
                                name="spot"
                                value={news.spot}
                                onChange={handleChange}
                                required
                                multiline
                                rows={2}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Haber İçeriği"
                                name="content"
                                value={news.content}
                                onChange={handleChange}
                                required
                                multiline
                                rows={6}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <FormControl fullWidth required>
                                    <InputLabel id="category-label">Kategori</InputLabel>
                                    <Select
                                        labelId="category-label"
                                        name="category"
                                        value={news.category}
                                        label="Kategori"
                                        onChange={handleCategoryChange}
                                    >
                                        {CATEGORIES.map((category) => (
                                            <MenuItem key={category} value={category}>
                                                {category}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <Tooltip title="AI ile Kategori Tahmin Et">
                                    <IconButton 
                                        onClick={handlePredictCategory}
                                        disabled={aiLoading.category || !news.content}
                                    >
                                        {aiLoading.category ? <CircularProgress size={24} /> : <CategoryIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Haber Pozisyonu
                            </Typography>
                            <FormGroup row>
                                {POSITIONS.map((position) => (
                                    <FormControlLabel
                                        key={position.value}
                                        control={
                                            <Checkbox
                                                checked={news.positions?.includes(position.value) || false}
                                                onChange={() => handlePositionChange(position.value)}
                                            />
                                        }
                                        label={position.label}
                                    />
                                ))}
                            </FormGroup>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    fullWidth
                                    label="Özet"
                                    name="summary"
                                    value={news.summary}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                />
                                <Tooltip title="AI ile Özet Oluştur">
                                    <IconButton 
                                        onClick={handleGenerateSummary}
                                        disabled={aiLoading.summary || !news.content}
                                    >
                                        {aiLoading.summary ? <CircularProgress size={24} /> : <SummarizeIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/admin')}
                                >
                                    İptal
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    {id ? 'Güncelle' : 'Kaydet'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default NewsForm; 