import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Button, Typography, Chip } from '@mui/material';
import NewsFeed from '../components/NewsFeed';
import TrendingNews from '../components/TrendingNews';
import NewsReels from './NewsReels';
import api from '../services/api';
import { News } from '../types/News';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const categories = [
  { title: 'GÜNCEL', path: '/guncel' },
  { title: 'TÜRKİYE', path: '/turkiye' },
  { title: 'DÜNYA', path: '/dunya' },
  { title: 'EKONOMİ', path: '/ekonomi' },
  { title: 'SPOR', path: '/spor' },
  { title: 'TEKNOLOJİ', path: '/teknoloji' },
  { title: 'YAŞAM', path: '/yasam' },
  { title: 'SAĞLIK', path: '/saglik' },
  { title: 'EĞİTİM', path: '/egitim' },
  { title: 'KÜLTÜR-SANAT', path: '/kultur-sanat' },
  { title: 'MAGAZİN', path: '/magazin' },
  { title: 'SİYASET', path: '/siyaset' }
];

// Görsel URL'sini düzgün döndüren fonksiyon
const getImageUrl = (image?: string | null) => {
  if (!image) return '/placeholder.svg';
  if (image.startsWith('http')) return image;
  if (image.startsWith('/uploads/')) return `http://localhost:8080${image}`;
  return image;
};

const HomePage: React.FC = () => {
  const [mansetler, setMansetler] = useState<News[]>([]);
  const [sonHaberler, setSonHaberler] = useState<News[]>([]);
  useEffect(() => {
    api.getAllNews().then(news => {
      const mansetHaberler = news.filter(n => n.positions?.includes('manset'));
      setMansetler(mansetHaberler.length > 0 ? mansetHaberler : news.slice(0, 3));
      setSonHaberler(news.slice(0, 6));
    });
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 0 }}>
      {/* Tam ekran slider */}
      <Box sx={{
        position: 'relative',
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        backgroundColor: '#000',
        overflow: 'hidden',
        mb: 4,
        minHeight: { xs: 220, sm: 320, md: 420 },
        maxHeight: { xs: 400, sm: 520, md: 650 },
      }}>
        <Swiper
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          style={{ width: '100%', height: '100%' }}
        >
          {mansetler.map((manset) => (
            <SwiperSlide key={manset.id}>
              <Box sx={{ position: 'relative', width: '100%', height: { xs: '40vh', sm: '55vh', md: '65vh' }, minHeight: 220, maxHeight: 650, overflow: 'hidden' }}>
                {(manset.imageUrl || manset.image) ? (
                  <Box
                    component="img"
                    src={getImageUrl(manset.imageUrl || manset.image)}
                    alt={manset.title}
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
                      objectPosition: 'center center',
                      filter: 'brightness(0.7)',
                      zIndex: 1,
                    }}
                  />
                ) : (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <Box sx={{ color: '#888', fontSize: 48 }}>🖼️</Box>
                  </Box>
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    width: '100%',
                    p: { xs: 3, sm: 5, md: 8 },
                    background: 'linear-gradient(to top, rgba(0,0,0,0.92) 60%, rgba(0,0,0,0.5) 100%, transparent)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    minHeight: { xs: 180, sm: 220, md: 260 }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Chip label={manset.category?.toUpperCase()} size="small" sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold', fontSize: { xs: '0.8rem', md: '0.95rem' }, height: { xs: 22, md: 26 }, px: { xs: 1, md: 2 }, letterSpacing: 1 }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: { xs: '0.95rem', md: '1.05rem' }, fontWeight: 500 }}>
                      {manset.publishDate?.slice(0, 10)}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: { xs: '1.3rem', sm: '2rem', md: '2.3rem', lg: '2.7rem' },
                      mb: 1,
                      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                      lineHeight: { xs: 1.2, md: 1.1 },
                      maxWidth: '95%',
                      letterSpacing: '-1px',
                    }}
                  >
                    {manset.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: 'white', opacity: 0.90, mb: 2, maxWidth: '80%', fontWeight: 400, fontSize: { xs: '1rem', md: '1.15rem' } }}
                  >
                    {manset.spot || manset.summary}
                  </Typography>
                  <Button variant="contained" color="secondary" size="medium" href={`/${manset.category}/${manset.id}`} sx={{ fontWeight: 700, borderRadius: 2, px: 3, py: 1, fontSize: '1rem', boxShadow: 2 }}>
                    Devamını Oku
                  </Button>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
      {/* Grid ile alt içerik */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={3} justifyContent="center">
          {/* Sol Sidebar - Trend Haberler */}
          <Grid item xs={12} md={3}>
            <Paper elevation={1} sx={{ position: 'sticky', top: 20, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 3 }}>
              <TrendingNews />
            </Paper>
          </Grid>
          {/* Orta Kısım - Kategoriler ve Son Haberler */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {categories.map(cat => (
                <Button key={cat.path} variant="outlined" color="primary" href={cat.path} sx={{ fontWeight: 700, borderRadius: 2 }}>
                  {cat.title}
                </Button>
              ))}
            </Box>
            {/* Son Haberler Grid */}
            <Grid container spacing={3}>
              {sonHaberler.map((haber) => (
                <Grid item xs={12} sm={6} md={4} key={haber.id}>
                  <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper', boxShadow: 3 }}>
                    <Box
                      component="img"
                      src={getImageUrl(haber.imageUrl || haber.image)}
                      alt={haber.title}
                      onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                        e.currentTarget.src = '/placeholder.svg';
                        e.currentTarget.onerror = null;
                      }}
                      sx={{ width: '100%', height: 180, objectFit: 'cover', objectPosition: 'center', mb: 1 }}
                    />
                    <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: '1.1rem', lineHeight: 1.2 }}>{haber.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>{haber.spot || haber.summary}</Typography>
                      <Button variant="outlined" color="primary" href={`/${haber.category}/${haber.id}`} sx={{ alignSelf: 'flex-start', fontWeight: 600, borderRadius: 2, px: 2, py: 0.5, fontSize: '0.95rem' }}>
                        Devamını Oku
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage; 