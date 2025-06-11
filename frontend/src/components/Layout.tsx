import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [showLogoutMessage, setShowLogoutMessage] = React.useState(false);

  const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  // Token süresini kontrol et
  useEffect(() => {
    if (isAuthenticated()) {
      const checkTokenExpiry = setInterval(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = payload.exp * 1000; // JWT'deki zaman damgası milisaniye cinsinden
            
            // Sürenin dolmasına 5 dakika kala uyarı göster
            if (expiryTime - Date.now() <= 5 * 60 * 1000) {
              setShowLogoutMessage(true);
              setTimeout(() => {
                localStorage.removeItem('adminToken');
                navigate('/');
              }, 5000); // 5 saniye sonra otomatik çıkış yap
            }
          } catch (error) {
            console.error('Token kontrol edilirken hata:', error);
            localStorage.removeItem('adminToken');
            navigate('/');
          }
        }
      }, 60000); // Her dakika kontrol et

      return () => clearInterval(checkTokenExpiry);
    }
  }, [navigate]);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      {children}
      <Snackbar
        open={showLogoutMessage}
        message="Oturumunuz sona eriyor. 5 saniye içinde otomatik çıkış yapılacak."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Layout; 