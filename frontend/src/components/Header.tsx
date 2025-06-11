import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  InputBase,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Divider,
  useTheme,
  alpha,
  useMediaQuery,
  Paper,
  Popper,
  Fade,
  ClickAwayListener
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  KeyboardArrowDown,
  Close as CloseIcon,
  Notifications,
  WbSunny,
  NightsStay
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useCustomTheme } from '../context/ThemeContext';

const mainCategories = [
  { title: 'GÜNCEL', path: '/guncel' },
  { title: 'TÜRKİYE', path: '/turkiye' },
  { title: 'DÜNYA', path: '/dunya' },
  { title: 'EKONOMİ', path: '/ekonomi' },
  { title: 'SPOR', path: '/spor' },
];

const allCategories = [
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

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  const handleCategoryClick = (event: React.MouseEvent<HTMLElement>) => {
    setCategoryMenuAnchor(categoryMenuAnchor ? null : event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Arama işlemleri burada yapılacak
    setSearchOpen(false);
  };

  return (
    <>
      {/* Üst Bar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* İlk Satır - Tarih, Logo ve İkonlar */}
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              minHeight: { xs: 50, md: 60 }, 
              justifyContent: 'space-between',
              px: { xs: 1, md: 2 }
            }}
          >
            <Typography
              sx={{
                color: 'text.primary',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
                display: { xs: 'none', md: 'block' }
              }}
            >
              {format(new Date(), 'dd MMMM yyyy, EEEE', { locale: tr })}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '1.5rem', md: '2rem' },
                color: theme.palette.primary.main,
                cursor: 'pointer',
                letterSpacing: -1,
                fontFamily: "'Roboto Condensed', sans-serif",
                display: 'flex',
                alignItems: 'center',
                '& span': {
                  color: theme.palette.text.primary,
                  fontSize: '80%',
                  ml: 0.5,
                  fontWeight: 700
                }
              }}
              onClick={() => navigate('/')}
            >
              NEWS<span>AI</span>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => setSearchOpen(true)}
                sx={{ color: 'text.primary' }}
              >
                <SearchIcon />
              </IconButton>
              
              {isAuthenticated() && (
                <>
                  <Button
                    size="small"
                    onClick={() => navigate('/admin/dashboard')}
                    sx={{ 
                      color: 'text.primary',
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    Admin Panel
                  </Button>
                  <Button
                    size="small"
                    onClick={handleLogout}
                    sx={{ 
                      color: 'text.primary',
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    Çıkış Yap
                  </Button>
                </>
              )}

              <IconButton
                size="small"
                sx={{ 
                  color: 'text.primary',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                <Notifications />
              </IconButton>

              <IconButton
                size="small"
                onClick={toggleDarkMode}
                sx={{ 
                  color: 'text.primary',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                {darkMode ? <NightsStay /> : <WbSunny />}
              </IconButton>

              <IconButton
                size="small"
                edge="end"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ 
                  color: 'text.primary',
                  display: { md: 'none' }
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* İkinci Satır - Kategoriler */}
        <Container maxWidth="xl">
          <Toolbar 
            variant="dense" 
            sx={{ 
              minHeight: { xs: 40, md: 50 },
              display: { xs: 'none', md: 'flex' },
              px: 2,
              gap: 3
            }}
          >
            {mainCategories.map((category) => (
              <Button
                key={category.path}
                sx={{
                  color: location.pathname === category.path ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === category.path ? 700 : 500,
                  fontSize: '0.9rem',
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'transparent'
                  }
                }}
                onClick={() => navigate(category.path)}
              >
                {category.title}
              </Button>
            ))}
            <Button
              endIcon={<KeyboardArrowDown />}
              onClick={handleCategoryClick}
              sx={{
                color: 'text.primary',
                fontWeight: 500,
                fontSize: '0.9rem',
                '&:hover': {
                  color: 'primary.main',
                  backgroundColor: 'transparent'
                }
              }}
            >
              DAHA FAZLA
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobil Menü */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: '80%', maxWidth: 360 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            MENÜ
          </Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {allCategories.map((category) => (
            <ListItem 
              key={category.path}
              onClick={() => {
                navigate(category.path);
                setMobileMenuOpen(false);
              }}
              sx={{ 
                py: 1.5,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1)
                }
              }}
            >
              <ListItemText 
                primary={category.title}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === category.path ? 700 : 500
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Arama Modal */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: { 
            bgcolor: 'background.paper',
            boxShadow: theme.shadows[3]
          }
        }}
      >
        <Container maxWidth="xl">
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <InputBase
              autoFocus
              placeholder="Haber ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                '& input': {
                  p: 1
                }
              }}
            />
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Container>
      </Drawer>

      {/* Kategori Menüsü */}
      <Popper
        open={Boolean(categoryMenuAnchor)}
        anchorEl={categoryMenuAnchor}
        placement="bottom-start"
        transition
        sx={{ zIndex: theme.zIndex.appBar + 1 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              elevation={3}
              sx={{
                mt: 1,
                p: 2,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 2,
                minWidth: 400
              }}
            >
              {allCategories.slice(5).map((category) => (
                <Button
                  key={category.path}
                  onClick={() => {
                    navigate(category.path);
                    handleCategoryClose();
                  }}
                  sx={{
                    color: 'text.primary',
                    justifyContent: 'flex-start',
                    fontWeight: location.pathname === category.path ? 700 : 500,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'transparent'
                    }
                  }}
                >
                  {category.title}
                </Button>
              ))}
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default Header; 