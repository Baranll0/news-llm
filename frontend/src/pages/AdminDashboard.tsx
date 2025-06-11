import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  Grid,
  Paper,
  IconButton,
  Card,
  CardContent,
  useTheme,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  TrendingUp,
  Article as ArticleIcon,
  Category as CategoryIcon,
  Visibility as ViewsIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { News, NewsFormData } from '../types/News';
import api from '../services/api';
import DashboardStats from '../components/DashboardStats';
import NewsForm from '../components/NewsForm';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { alpha } from '@mui/material/styles';

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [news, setNews] = useState<News[]>([]);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await api.getAllNews();
      setNews(data);
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, newsId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedNewsId(newsId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNewsId(null);
  };

  const handleAddNews = () => {
    setSelectedNews(null);
    setIsFormOpen(true);
  };

  const handleEditNews = (id: string) => {
    const newsItem = news.find(item => item.id.toString() === id);
    setSelectedNews(newsItem || null);
    setIsFormOpen(true);
    handleMenuClose();
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      try {
        await api.deleteNews(id);
        await fetchNews();
      } catch (error) {
        console.error('Haber silinirken hata:', error);
        alert('Haber silinirken bir hata oluştu!');
      }
    }
    handleMenuClose();
  };

  const handleViewNews = (id: string) => {
    const newsItem = news.find(item => item.id.toString() === id);
    if (newsItem) {
      navigate(`/${newsItem.category}/${id}`);
    }
    handleMenuClose();
  };

  const handleSubmit = async (data: NewsFormData) => {
    try {
      if (selectedNews) {
        await api.updateNews(selectedNews.id.toString(), data);
        alert('Haber başarıyla güncellendi!');
      } else {
        await api.createNews(data);
        alert('Haber başarıyla eklendi!');
      }
      fetchNews();
      setIsFormOpen(false);
      setSelectedNews(null);
    } catch (error) {
      console.error('Haber kaydedilirken hata oluştu:', error);
      alert('Haber kaydedilirken bir hata oluştu!');
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedNews(null);
  };

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${API_URL}${imageUrl}`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' ? 'background.default' : '#f5f5f5',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <ArticleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            Haber Yönetimi
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchNews}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Yenile
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNews}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
                boxShadow: 2
              }}
            >
              Yeni Haber Ekle
            </Button>
          </Box>
        </Box>

        {/* İstatistikler */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                boxShadow: theme.shadows[2]
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main'
                  }}
                >
                  <ArticleIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Toplam Haber
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {news.length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                boxShadow: theme.shadows[2]
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    color: 'success.main'
                  }}
                >
                  <CategoryIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Kategoriler
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                {Array.from(new Set(news.map(item => item.category))).length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
                boxShadow: theme.shadows[2]
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.info.main, 0.1),
                    color: 'info.main'
                  }}
                >
                  <ViewsIcon />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Toplam Görüntülenme
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                {news.reduce((total, item) => total + (item.views || 0), 0)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Haber Listesi */}
        <Grid container spacing={3}>
          {news.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: theme.shadows[2],
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[4]
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '56.25%', // 16:9 aspect ratio
                    bgcolor: 'grey.100'
                  }}
                >
                  <Box
                    component="img"
                    src={getImageUrl(item.image)}
                    alt={item.title}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      bgcolor: alpha(theme.palette.primary.main, 0.9),
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'background.paper',
                      '&:hover': { bgcolor: 'background.paper' }
                    }}
                    onClick={(e) => handleMenuOpen(e, item.id.toString())}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {item.spot}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <ViewsIcon sx={{ fontSize: 16 }} />
                      {item.views || 0} görüntülenme
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary' }}
                    >
                      {format(new Date(item.publishDate), 'dd MMM yyyy', { locale: tr })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* İşlem Menüsü */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          sx={{ '& .MuiPaper-root': { borderRadius: 2, mt: 1 } }}
        >
          <MenuItem onClick={() => selectedNewsId && handleViewNews(selectedNewsId)}>
            <ViewsIcon sx={{ mr: 1, fontSize: 20 }} />
            Haberi Görüntüle
          </MenuItem>
          <MenuItem onClick={() => selectedNewsId && handleEditNews(selectedNewsId)}>
            <EditIcon sx={{ mr: 1, fontSize: 20 }} />
            Düzenle
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => selectedNewsId && handleDeleteNews(selectedNewsId)}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
            Sil
          </MenuItem>
        </Menu>

        {/* Haber Formu Dialog */}
        <Dialog
          open={isFormOpen}
          onClose={handleFormCancel}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white'
            }
          }}
        >
          <NewsForm
            initialData={selectedNews ? {
              title: selectedNews.title || '',
              spot: selectedNews.spot || '',
              content: selectedNews.content || '',
              category: selectedNews.category || '',
              summary: selectedNews.summary || '',
              positions: selectedNews.positions || ['normal'],
              imageUrl: selectedNews.image || ''
            } : undefined}
            onSubmit={handleSubmit}
            onCancel={handleFormCancel}
          />
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 