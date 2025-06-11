import React from 'react';
import { Box, Typography } from '@mui/material';
import { News } from '../types/News';
import { useNavigate } from 'react-router-dom';

interface NewsSliderProps {
  news: News[];
  getImageUrl: (image: string | null) => string;
}

const NewsSlider: React.FC<NewsSliderProps> = ({ news, getImageUrl }) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
        pb: 2,
        '&::-webkit-scrollbar': {
          height: 8,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#E31837',
          borderRadius: 4,
        },
      }}
    >
      {news.map((item) => (
        <Box
          key={item.id}
          sx={{
            minWidth: 300,
            cursor: 'pointer',
            '&:hover img': {
              transform: 'scale(1.05)',
            },
            '&:hover .news-title': {
              color: '#E31837',
            },
          }}
          onClick={() => navigate(`/${item.category}/${item.id}`)}
        >
          <Box
            sx={{
              position: 'relative',
              height: 180,
              borderRadius: 1,
              overflow: 'hidden',
              mb: 1,
            }}
          >
            <Box
              component="img"
              src={getImageUrl(item.image)}
              alt={item.title}
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
          <Typography
            className="news-title"
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              transition: 'color 0.2s',
            }}
          >
            {item.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default NewsSlider; 