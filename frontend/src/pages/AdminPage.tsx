import React, { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    Divider,
    TextField,
    InputAdornment,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    FilterList as FilterIcon,
    Article as ArticleIcon,
    Category as CategoryIcon,
    TrendingUp as TrendingUpIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { News } from '../types/News';
import api from '../services/api';

const AdminPage: React.FC = () => {
    const [news, setNews] = useState<News[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [stats, setStats] = useState({
        totalNews: 0,
        categories: 0,
        trending: 0
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchNews();
        // Gerçek API'den alınacak istatistikler
        setStats({
            totalNews: news.length,
            categories: 6,
            trending: 3
        });
    }, []);

    const fetchNews = async () => {
        try {
            const data = await api.getAllNews();
            setNews(data);
        } catch (error) {
            console.error('Haberler yüklenirken hata oluştu:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
            try {
                await api.deleteNews(id);
                await fetchNews();
            } catch (error) {
                console.error('Haber silinirken hata oluştu:', error);
            }
        }
    };

    const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterClose = (category: string) => {
        setAnchorEl(null);
        setSelectedCategory(category);
    };

    const filteredNews = news.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* İstatistik Kartları */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <ArticleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Toplam Haber
                                </Typography>
                                <Typography variant="h4">
                                    {stats.totalNews}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <CategoryIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Kategoriler
                                </Typography>
                                <Typography variant="h4">
                                    {stats.categories}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                            <Box>
                                <Typography color="textSecondary" gutterBottom>
                                    Trend Haberler
                                </Typography>
                                <Typography variant="h4">
                                    {stats.trending}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Arama ve Filtre Alanı */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Haber ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterIcon />}
                            onClick={handleFilterClick}
                            sx={{ mr: 2 }}
                        >
                            {selectedCategory || 'Kategori Filtrele'}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/admin/add')}
                        >
                            Yeni Haber Ekle
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Kategori Filtre Menüsü */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleFilterClose('')}
            >
                <MenuItem onClick={() => handleFilterClose('')}>Tümü</MenuItem>
                {['Spor', 'Ekonomi', 'Teknoloji', 'Siyaset', 'Sağlık', 'Eğitim'].map((category) => (
                    <MenuItem key={category} onClick={() => handleFilterClose(category)}>
                        {category}
                    </MenuItem>
                ))}
            </Menu>

            {/* Haber Tablosu */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Başlık</TableCell>
                            <TableCell>Kategori</TableCell>
                            <TableCell>Oluşturulma Tarihi</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell align="right">İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredNews.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.category}
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    {new Date(item.publishDate).toLocaleDateString('tr-TR')}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.status}
                                        size="small"
                                        color={item.status === 'published' ? 'success' : 
                                               item.status === 'draft' ? 'warning' : 'default'}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        color="primary"
                                        onClick={() => navigate(`/admin/edit/${item.id}`)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(item.id.toString())}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton size="small">
                                        <MoreVertIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminPage; 