import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { News } from '../types/News';
import { useNavigate } from 'react-router-dom';

interface NewsCardProps {
  news: News;
  getImageUrl: (image: string | null) => string;
}

const NewsCard: React.FC<NewsCardProps> = ({ news, getImageUrl }) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        cursor: 'pointer',
        '&:hover': {
          '& img': {
            transform: 'scale(1.05)',
          },
          '& .news-title': {
            color: '#E31837',
          },
        },
      }}
      onClick={() => navigate(`/${news.category}/${news.id}`)}
    >
      <Box
        sx={{
          position: 'relative',
          height: 200,
          borderRadius: 1,
          overflow: 'hidden',
          mb: 2,
        }}
      >
        <Box
          component="img"
          src={getImageUrl(news.image)}
          alt={news.title}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      </Box>
      <Box sx={{ p: 2 }}>
        <Typography
          className="news-title"
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            transition: 'color 0.2s',
          }}
        >
          {news.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {news.spot}
        </Typography>
      </Box>
    </Paper>
  );
};

export default NewsCard; 