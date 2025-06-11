import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Avatar, Chip, Button, IconButton } from '@mui/material';
import { Favorite, Comment, Share, Bookmark } from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../services/api';
import { News } from '../types/News';
import { useNavigate } from 'react-router-dom';

const getImageUrl = (image: string | null | undefined, imageUrl?: string | null | undefined) => {
  if (imageUrl && imageUrl.startsWith('http')) return imageUrl;
  if (image && image.startsWith('http')) return image;
  if (image && image.startsWith('/uploads/')) return `http://localhost:8080${image}`;
  if (imageUrl && imageUrl.startsWith('/uploads/')) return `http://localhost:8080${imageUrl}`;
  return 'https://via.placeholder.com/600x400';
};

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getAllNews();
        setNews(data);
      } catch (error) {
        console.error('Haberler alınamadı:', error);
      }
    };
    fetchNews();
  }, []);

  const handleReadMore = (item: News) => {
    navigate(`/${item.category}/${item.id}`);
  };

  const handleLike = (id: string) => {
    setNews(prevNews =>
      prevNews.map(news =>
        news.id === id ? { ...news, views: (news.views || 0) + 1 } : news
      )
    );
  };

  return (
    <Box sx={{ maxWidth: 600, margin: '0 auto', py: 2 }}>
      {news.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar src={getImageUrl(item.image, item.imageUrl)} />
              <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1">{item.category}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.publishDate}
                </Typography>
              </Box>
              <Chip 
                label={item.category} 
                size="small" 
                sx={{ ml: 'auto' }}
              />
            </Box>
            <CardMedia
              component="img"
              height="400"
              image={getImageUrl(item.image, item.imageUrl)}
              alt={item.title}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="body1" paragraph>
                {item.spot || item.summary || item.content?.slice(0, 120) + '...'}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                  <IconButton onClick={() => handleLike(item.id)}>
                    <Favorite />
                  </IconButton>
                  <Typography variant="caption">{item.views}</Typography>
                  <IconButton>
                    <Comment />
                  </IconButton>
                  <Typography variant="caption">0</Typography>
                  <IconButton>
                    <Share />
                  </IconButton>
                  <Typography variant="caption">0</Typography>
                  <IconButton>
                    <Bookmark />
                  </IconButton>
                </Box>
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={() => handleReadMore(item)}
                  sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                    borderWidth: 2,
                    px: 2,
                    py: 1,
                    backgroundColor: 'background.paper',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'secondary.main',
                      color: 'white',
                      borderColor: 'secondary.main',
                    }
                  }}
                >
                  Devamını Oku
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </Box>
  );
};

export default NewsFeed; 