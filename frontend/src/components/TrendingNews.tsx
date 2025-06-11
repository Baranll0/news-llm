import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';
import { News } from '../types/News';

const getImageUrl = (image: string | null | undefined) => {
  if (!image) return 'https://via.placeholder.com/300x200';
  if (image.startsWith('http')) return image;
  return `http://localhost:8080${image}`;
};

const TrendingNews: React.FC = () => {
  const [trendingNews, setTrendingNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const allNews = await api.getAllNews();
        setTrendingNews(allNews.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5));
      } catch (error) {
        console.error('Trend haberler alınamadı:', error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">Trend Haberler</Typography>
      </Box>
      {trendingNews.map((news, index) => (
        <motion.div
          key={news.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card sx={{ mb: 2, display: 'flex', cursor: 'pointer' }}>
            <CardMedia
              component="img"
              sx={{ width: 120 }}
              image={getImageUrl(news.image)}
              alt={news.title}
            />
            <CardContent sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Chip 
                  label={news.category} 
                  size="small" 
                  sx={{ mr: 1 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {(news.views || 0).toLocaleString()} görüntülenme
                </Typography>
              </Box>
              <Typography variant="subtitle1" noWrap>
                {news.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {news.publishDate}
              </Typography>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default TrendingNews; 