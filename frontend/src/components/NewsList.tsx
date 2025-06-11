import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Grid,
  Menu,
} from '@mui/material';
import {
  Edit,
  Delete,
  MoreVert,
  Visibility,
} from '@mui/icons-material';
import { News } from '../types/News';

interface NewsListProps {
  news: News[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

const NewsList: React.FC<NewsListProps> = ({
  news,
  onEdit,
  onDelete,
  onView,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNewsId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNewsId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const displayedNews = filteredNews.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ width: '100%', mt: 3 }}>
      <Paper sx={{ width: '100%', mb: 2, p: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Haber Ara"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth size="small">
              <InputLabel>Kategori Filtrele</InputLabel>
              <Select
                value={categoryFilter}
                label="Kategori Filtrele"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="politika">Politika</MenuItem>
                <MenuItem value="ekonomi">Ekonomi</MenuItem>
                <MenuItem value="spor">Spor</MenuItem>
                <MenuItem value="teknoloji">Teknoloji</MenuItem>
                <MenuItem value="kultur">Kültür Sanat</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="haber listesi">
            <TableHead>
              <TableRow>
                <TableCell>Başlık</TableCell>
                <TableCell>Kategori</TableCell>
                <TableCell>Yayın Tarihi</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Görüntülenme</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedNews.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell>
                    <Chip label={row.category} size="small" />
                  </TableCell>
                  <TableCell>{row.publishDate}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      size="small"
                      color={getStatusColor(row.status)}
                    />
                  </TableCell>
                  <TableCell>{row.views}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, row.id.toString())}
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredNews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına haber"
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              if (selectedNewsId) onView(selectedNewsId);
              handleMenuClose();
            }}
          >
            <Visibility sx={{ mr: 1 }} /> Görüntüle
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedNewsId) onEdit(selectedNewsId);
              handleMenuClose();
            }}
          >
            <Edit sx={{ mr: 1 }} /> Düzenle
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedNewsId) onDelete(selectedNewsId);
              handleMenuClose();
            }}
          >
            <Delete sx={{ mr: 1 }} /> Sil
          </MenuItem>
        </Menu>
      </Paper>
    </Box>
  );
};

export default NewsList; 