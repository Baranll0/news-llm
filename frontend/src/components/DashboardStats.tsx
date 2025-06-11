import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import {
  Article as ArticleIcon,
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

interface DashboardStatsProps {
  totalNews: number;
  totalCategories: number;
  totalViews: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalNews,
  totalCategories,
  totalViews
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <ArticleIcon sx={{ fontSize: 40, mr: 2, color: '#1976d2' }} />
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Toplam Haber
              </Typography>
              <Typography variant="h4">
                {totalNews}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <CategoryIcon sx={{ fontSize: 40, mr: 2, color: '#9c27b0' }} />
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Kategoriler
              </Typography>
              <Typography variant="h4">
                {totalCategories}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 40, mr: 2, color: '#2e7d32' }} />
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Trend Haberler
              </Typography>
              <Typography variant="h4">
                0
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ height: '100%' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
            <VisibilityIcon sx={{ fontSize: 40, mr: 2, color: '#ed6c02' }} />
            <Box>
              <Typography color="textSecondary" gutterBottom>
                Toplam Görüntülenme
              </Typography>
              <Typography variant="h4">
                {totalViews}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default DashboardStats; 