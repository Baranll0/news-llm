import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import NewsDetail from './pages/NewsDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NewsForm from './components/NewsForm';
import Layout from './components/Layout';
import { ThemeProvider } from './context/ThemeContext';
import NewsReels from './pages/NewsReels';

// Form wrapper bileşeni
const NewsFormWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (data: any) => {
    try {
      // Form gönderimi işlemleri
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Form gönderimi sırasında hata:', error);
    }
  };

  const handleFormCancel = () => {
    navigate('/admin/dashboard');
  };

  return (
    <NewsForm 
      onSubmit={handleFormSubmit}
      onCancel={handleFormCancel}
    />
  );
};

const App: React.FC = () => {
  const isAuthenticated = () => {
    return !!localStorage.getItem('adminToken');
  };

  const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated() ? <>{children}</> : <Navigate to="/admin" />;
  };

  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
              <Route path="/:category" element={<CategoryPage />} />
              <Route path="/:category/:id" element={<NewsDetail />} />
              <Route 
                path="/admin/news/add" 
                element={
                  <PrivateRoute>
                    <NewsFormWrapper />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/news/edit/:id" 
                element={
                  <PrivateRoute>
                    <NewsFormWrapper />
                  </PrivateRoute>
                } 
              />
              <Route path="/reels" element={<NewsReels />} />
            </Routes>
          </Box>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
