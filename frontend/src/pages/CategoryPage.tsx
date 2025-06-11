import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  alpha,
  Skeleton,
  Tooltip,
  Pagination
} from '@mui/material';
import {
  AccessTime,
  RemoveRedEye,
  Facebook,
  Twitter,
  WhatsApp,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { News } from '../types/News';
import api from '../services/api';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { API_URL, UPLOADS_URL } from '../config';

// Kategori renk kodları
const categoryColors: Record<string, string> = {
  spor: '#e53935',
  ekonomi: '#43a047',
  teknoloji: '#1e88e5',
  siyaset: '#6d4c41',
  saglik: '#00acc1',
  egitim: '#fb8c00',
  yasam: '#8e24aa',
  'kultur-sanat': '#5e35b1',
  magazin: '#d81b60',
  dunya: '#3949ab',
  genel: '#546e7a',
  guncel: '#f4511e',
  planet: '#00897b',
  turkiye: '#c62828'
};

const getImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return '/placeholder.svg';
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Eğer yol zaten /uploads ile başlıyorsa, sadece API_URL ile birleştir
  const url = `${API_URL}${imageUrl}`;
  console.log('Oluşturulan görsel URL:', url);
  console.log('Orijinal görsel yolu:', imageUrl);
  return url;
};

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const theme = useTheme();
  const navigate = useNavigate();
  const [haberler, setHaberler] = useState<News[]>([]);
  const [trendHaberler, setTrendHaberler] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const habersPerPage = 12;

  useEffect(() => {
    fetchHaberler();
  }, [category]);

  const fetchHaberler = async () => {
    try {
      setLoading(true);
      const tumHaberler = await api.getAllNews();
      
      // Kategori haberleri - kategori adını normalize et
      const normalizedCategory = category?.toLowerCase().trim();
      const kategoriHaberleri = tumHaberler.filter(haber => 
        haber.category?.toLowerCase().trim() === normalizedCategory
      );
      setHaberler(kategoriHaberleri);

      // Trend haberler (görüntülenme sayısına göre)
      const trendler = kategoriHaberleri
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);
      setTrendHaberler(trendler);

      setLoading(false);
    } catch (error) {
      console.error('Haberler yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const handleHaberClick = (haber: News) => {
    navigate(`/${haber.category}/${haber.id}`);
  };

  const handleShare = (platform: string, haber: News) => {
    const url = `${window.location.origin}/${haber.category}/${haber.id}`;
    const text = haber.title;

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

  // Trend Haberler Bölümü
  const TrendHaberler = () => (
    <Box
      sx={{
        background: theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
        boxShadow: theme.shadows[3],
        mb: 4
      }}
    >
      <Typography
        variant="h5"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          color: categoryColors[category || 'genel'],
          fontWeight: 'bold'
        }}
      >
        <TrendingUp />
        TREND HABERLER
      </Typography>
      {trendHaberler.map((haber, index) => (
        <Box
          key={haber.id}
          component={motion.div}
          whileHover={{ x: 10 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 2,
            p: 2,
            borderRadius: 1,
            cursor: 'pointer',
            '&:hover': {
              bgcolor: alpha(categoryColors[category || 'genel'], 0.1)
            }
          }}
          onClick={() => handleHaberClick(haber)}
        >
          <Typography
            variant="h2"
            sx={{
              color: alpha(categoryColors[category || 'genel'], 0.3),
              fontWeight: 'bold',
              minWidth: '60px'
            }}
          >
            {index + 1}
          </Typography>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">{haber.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                <RemoveRedEye sx={{ fontSize: 16, mr: 0.5 }} />
                {haber.views || 0} görüntülenme
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );

  if (loading) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} height={200} sx={{ mb: 2 }} />
          ))}
        </Box>
      </Container>
    );
  }

  const pageCount = Math.ceil(haberler.length / habersPerPage);
  const displayedHaberler = haberler.slice(
    (page - 1) * habersPerPage,
    page * habersPerPage
  );

  return (
    <Box>
      <Box 
        sx={{ 
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          backgroundColor: '#000',
          overflow: 'hidden',
          mb: 6
        }}
      >
        <Box sx={{ 
          position: 'relative',
          height: { xs: '60vh', sm: '70vh', md: '80vh' },
          minHeight: { xs: '400px', sm: '500px', md: '600px' },
          maxHeight: { xs: '600px', sm: '700px', md: '800px' },
          overflow: 'hidden'
        }}>
          {haberler[0] && (
            <Box
              sx={{ 
                position: 'relative',
                height: '100%',
                cursor: 'pointer',
                '&:hover img': {
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => handleHaberClick(haberler[0])}
            >
              <Box
                component="img"
                src={getImageUrl(haberler[0].image)}
                alt={haberler[0].title}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = '/placeholder.svg';
                  e.currentTarget.onerror = null;
                }}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  filter: 'brightness(0.7)',
                  transition: 'all 0.5s ease',
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0.4) 60%, transparent)',
                  padding: { 
                    xs: '120px 20px 60px', 
                    sm: '160px 40px 80px', 
                    md: '200px 60px 100px' 
                  },
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.5) 60%, transparent)'
                  }
                }}
              >
                <Box sx={{ 
                  maxWidth: '1600px', 
                  margin: '0 auto',
                  width: '100%'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2,
                    mb: { xs: 2, md: 3 }
                  }}>
                    <Chip 
                      label={category?.toUpperCase()} 
                      size="small"
                      sx={{ 
                        bgcolor: categoryColors[category || 'genel'],
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: { xs: '0.75rem', md: '0.875rem' },
                        height: { xs: 24, md: 28 },
                        px: { xs: 1, md: 2 }
                      }} 
                    />
                    <Typography 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: { xs: '0.9rem', md: '1rem' },
                        fontWeight: 500
                      }}
                    >
                      <AccessTime sx={{ fontSize: { xs: 16, md: 20 }, mr: 0.5 }} />
                      {format(new Date(haberler[0].publishDate), 'dd MMM yyyy', { locale: tr })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h1"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: { 
                        xs: '1.75rem', 
                        sm: '2.5rem', 
                        md: '3.5rem', 
                        lg: '4rem' 
                      },
                      mb: { xs: 1, md: 2 },
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      lineHeight: { xs: 1.2, md: 1.1 },
                      maxWidth: '80%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.01)'
                      }
                    }}
                  >
                    {haberler[0].title}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      <Container sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            color: categoryColors[category || 'genel'],
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}
        >
          {category}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {displayedHaberler.slice(1).map((haber) => (
                <Grid item xs={12} sm={6} key={haber.id}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -10 }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: theme.shadows[2],
                      '&:hover': {
                        boxShadow: theme.shadows[10],
                        transform: 'translateY(-10px)',
                        '& img': {
                          transform: 'scale(1.1)',
                        }
                      }
                    }}
                    onClick={() => handleHaberClick(haber)}
                  >
                    <Box sx={{ position: 'relative', pt: '56.25%' }}>
                      <CardMedia
                        component="img"
                        image={getImageUrl(haber.image)}
                        alt={haber.title}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.src = '/placeholder.svg';
                          e.currentTarget.onerror = null;
                        }}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7))',
                          transition: 'all 0.3s ease',
                          opacity: 0.8,
                          '&:hover': {
                            opacity: 1
                          }
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: '1.1rem', md: '1.25rem' },
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.3
                          }}
                        >
                          {haber.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 2,
                            fontSize: '0.9rem',
                            lineHeight: 1.6
                          }}
                        >
                          {haber.spot}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mt: 'auto'
                      }}>
                        <Typography 
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            color: 'text.secondary',
                            fontSize: '0.85rem'
                          }}
                        >
                          <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                          {format(new Date(haber.publishDate), 'dd MMM yyyy', { locale: tr })}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Facebook'ta Paylaş">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare('facebook', haber);
                              }}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': { color: '#1877f2' }
                              }}
                            >
                              <Facebook fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Twitter'da Paylaş">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare('twitter', haber);
                              }}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': { color: '#1da1f2' }
                              }}
                            >
                              <Twitter fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="WhatsApp'ta Paylaş">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShare('whatsapp', haber);
                              }}
                              sx={{ 
                                color: 'text.secondary',
                                '&:hover': { color: '#25d366' }
                              }}
                            >
                              <WhatsApp fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 6,
              mb: 4 
            }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: '1rem',
                    minWidth: 40,
                    height: 40,
                  }
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <TrendHaberler />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoryPage; 