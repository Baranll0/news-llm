import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { News } from '../types/News';
import { AccessTime } from '@mui/icons-material';

interface SideNewsProps {
  news: News[];
}

const SideNews: React.FC<SideNewsProps> = ({ news }) => {
  const navigate = useNavigate();

  const handleNewsClick = (id: string, category: string) => {
    navigate(`/${category}/${id}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Grid container spacing={2}>
      {news.map((item) => (
        <Grid item xs={12} key={item.id}>
          <Card
            sx={{
              display: 'flex',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
            onClick={() => handleNewsClick(item.id.toString(), item.category)}
          >
            <CardMedia
              component="img"
              sx={{
                width: 140,
                height: 100,
                objectFit: 'cover',
              }}
              image={item.imageUrl}
              alt={item.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <CardContent sx={{ flex: '1 0 auto', p: 2 }}>
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={item.category}
                    size="small"
                    color="primary"
                    sx={{ mb: 1 }}
                  />
                </Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    mb: 0.5,
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <AccessTime fontSize="small" />
                  {formatDate(item.publishDate)}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SideNews; 