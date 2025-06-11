import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Breadcrumbs,
  Divider,
  Paper,
  Grid,
  Chip,
  IconButton,
  CardMedia,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon,
  Link as LinkIcon,
  Visibility as VisibilityIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import api from '../services/api';
import { News } from '../types/News';
import { API_URL, UPLOADS_URL } from '../config';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { alpha } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';

const NewsDetail: React.FC = () => {
  const theme = useTheme();
  const { id, category } = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [sideNews, setSideNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsResponse, allNewsResponse] = await Promise.all([
          api.getNewsById(id!),
          api.getAllNews()
        ]);
        setNews(newsResponse);
        // Son dakika haberlerini filtrele
        const sonDakikaHaberleri = allNewsResponse.filter(
          item => item.positions?.includes('son_dakika')
        ).slice(0, 5);
        setSideNews(sonDakikaHaberleri);
      } catch (error) {
        console.error('Haber yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getImageUrl = (imageUrl: string | null | undefined) => {
    if (!imageUrl) return '/placeholder.svg';
    if (imageUrl.startsWith('http')) return imageUrl;
    
    // Eğer yol zaten /uploads ile başlıyorsa, sadece API_URL ile birleştir
    const url = `${API_URL}${imageUrl}`;
    console.log('Oluşturulan görsel URL:', url);
    console.log('Orijinal görsel yolu:', imageUrl);
    return url;
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = news?.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
        break;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Yükleniyor...</Typography>
        </Box>
      </Container>
    );
  }

  if (!news) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Haber bulunamadı.</Typography>
        </Box>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        {/* Ana Haber İçeriği */}
        <Grid item xs={12} md={8}>
          <Box sx={{ 
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: { xs: 2, md: 4 },
            boxShadow: 1
          }}>
            <Breadcrumbs 
              separator="›" 
              sx={{ 
                mb: 3,
                '& .MuiBreadcrumbs-separator': {
                  color: 'text.primary'
                }
              }}
            >
              <RouterLink 
                to="/" 
                style={{ 
                  color: theme.palette.text.primary,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.palette.primary.main;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.palette.text.primary;
                }}
              >
                Anasayfa
              </RouterLink>
              <RouterLink 
                to={`/${category}`}
                style={{ 
                  color: theme.palette.text.primary,
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = theme.palette.primary.main;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = theme.palette.text.primary;
                }}
              >
                {category}
              </RouterLink>
              <Typography color="text.primary">{news?.title}</Typography>
            </Breadcrumbs>

            <Chip
              label={category}
              sx={{
                bgcolor: theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : theme.palette.primary.main,
                color: theme.palette.mode === 'dark' ? theme.palette.primary.main : theme.palette.common.white,
                mb: 2
              }}
            />

            <Typography 
              variant="h1" 
              sx={{ 
                fontSize: { xs: '1.5rem', md: '2.5rem' },
                fontWeight: 700,
                mb: 2,
                color: 'text.primary'
              }}
            >
              {news?.title}
            </Typography>

            <Typography 
              variant="subtitle1" 
              sx={{ 
                mb: 3,
                color: 'text.secondary',
                fontSize: { xs: '1rem', md: '1.1rem' }
              }}
            >
              {news?.spot}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              mb: 4,
              color: 'text.secondary'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  {format(new Date(news?.publishDate || ''), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 20 }} />
                <Typography variant="body2">
                  {news?.views || 0} görüntülenme
                </Typography>
              </Box>
            </Box>

            <Box 
              component="img"
              src={getImageUrl(news?.image)}
              alt={news?.title}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '600px',
                objectFit: 'cover',
                borderRadius: 1,
                mb: 4
              }}
            />

            <Typography 
              component="div"
              sx={{ 
                mb: 4,
                color: 'text.primary',
                fontSize: { xs: '1rem', md: '1.1rem' },
                lineHeight: 1.8,
                '& p': {
                  mb: 2,
                  color: 'text.primary'
                },
                '& strong': {
                  fontWeight: 700,
                  color: 'text.primary',
                  display: 'block',
                  fontSize: '1.2rem',
                  my: 2
                },
                '& br': {
                  display: 'none'
                }
              }}
              dangerouslySetInnerHTML={{ __html: news?.content || '' }}
            />

            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              justifyContent: 'center',
              borderTop: 1,
              borderColor: 'divider',
              pt: 3
            }}>
              <Tooltip title="Facebook'ta Paylaş">
                <IconButton 
                  onClick={() => handleShare('facebook')}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      color: '#1877F2',
                      bgcolor: alpha('#1877F2', 0.1)
                    }
                  }}
                >
                  <FacebookIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Twitter'da Paylaş">
                <IconButton 
                  onClick={() => handleShare('twitter')}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      color: '#1DA1F2',
                      bgcolor: alpha('#1DA1F2', 0.1)
                    }
                  }}
                >
                  <TwitterIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="WhatsApp'ta Paylaş">
                <IconButton 
                  onClick={() => handleShare('whatsapp')}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      color: '#25D366',
                      bgcolor: alpha('#25D366', 0.1)
                    }
                  }}
                >
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Grid>

        {/* Sağ Sidebar - Son Dakika Haberleri */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
              position: 'sticky',
              top: 24
            }}
          >
            <Typography
              variant="h6"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 3,
                pb: 2,
                borderBottom: 1,
                borderColor: 'divider',
                color: 'primary.main',
                fontWeight: 'bold',
                fontSize: '1.2rem'
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  animation: 'pulse 2s infinite'
                }}
              />
              SON DAKİKA
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sideNews.map((item) => (
                <RouterLink
                  key={item.id}
                  to={`/${item.category}/${item.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateX(8px)'
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      sx={{
                        width: 100,
                        height: 60,
                        borderRadius: 1,
                        objectFit: 'cover'
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'text.primary',
                          fontWeight: 500,
                          fontSize: '0.9rem',
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '0.7rem',
                            bgcolor: theme.palette.mode === 'dark' 
                              ? alpha(theme.palette.primary.main, 0.2) 
                              : alpha(theme.palette.primary.main, 0.1),
                            color: theme.palette.primary.main,
                            fontWeight: 500
                          }}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <AccessTimeIcon sx={{ fontSize: 14 }} />
                          {format(new Date(item.publishDate), 'HH:mm', { locale: tr })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </RouterLink>
              ))}
            </Box>

            {/* Tümünü Gör Butonu */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <RouterLink to="/son-dakika" style={{ textDecoration: 'none' }}>
                <Typography
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Tüm Son Dakika Haberlerini Gör →
                </Typography>
              </RouterLink>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsDetail; 