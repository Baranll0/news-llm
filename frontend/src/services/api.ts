import axios from 'axios';
import { News, NewsFormData } from '../types/News';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const AI_URL = process.env.REACT_APP_AI_URL || 'http://localhost:8000';

export interface LoginResponse {
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

const getAuthHeader = () => {
  const token = localStorage.getItem('adminToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
    async createNews(newsData: NewsFormData): Promise<News> {
        try {
            console.log('Gönderilen haber verisi:', newsData);
            const response = await axios.post(`${API_URL}/api/news`, newsData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Haber oluşturulamadı:', error);
            throw error;
        }
    },

    async getAllNews(): Promise<News[]> {
        try {
            const response = await axios.get(`${API_URL}/api/news`);
            return response.data;
        } catch (error) {
            console.error('Haberler alınamadı:', error);
            throw error;
        }
    },

    async getNewsByCategory(category: string): Promise<News[]> {
        try {
            const response = await axios.get(`${API_URL}/api/news/category/${category}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching news by category:', error);
            return [];
        }
    },

    async getNewsById(id: string): Promise<News> {
        try {
            const response = await axios.get(`${API_URL}/api/news/${id}`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Haber alınamadı:', error);
            throw error;
        }
    },

    async updateNews(id: string, newsData: NewsFormData): Promise<News> {
        try {
            const response = await axios.put(`${API_URL}/api/news/${id}`, newsData, {
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader(),
                },
            });
            return response.data;
        } catch (error) {
            console.error('Haber güncellenemedi:', error);
            throw error;
        }
    },

    async deleteNews(id: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/api/news/${id}`, {
                headers: {
                    ...getAuthHeader(),
                },
            });
        } catch (error) {
            console.error('Haber silinemedi:', error);
            throw error;
        }
    },

    uploadImage: async (file: File): Promise<string | null> => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            console.log('Görsel yükleniyor:', file);
            const response = await axios.post(`${API_URL}/api/news/upload`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Görsel yükleme yanıtı:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            return null;
        }
    },

    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Giriş başarısız');
        }

        return response.json();
    },

    async generateTitle(text: string): Promise<{ title: string }> {
        try {
            const response = await axios.post(`${AI_URL}/ai/generate-title`, { text });
            return response.data;
        } catch (error) {
            console.error('Başlık üretilemedi:', error);
            throw error;
        }
    },

    async generateSummary(text: string): Promise<{ summary: string }> {
        try {
            const response = await axios.post(`${AI_URL}/ai/summarize`, { text });
            return response.data;
        } catch (error) {
            console.error('Özet üretilemedi:', error);
            throw error;
        }
    },

    async predictCategory(text: string): Promise<{ category: string; confidence: number }> {
        try {
            const response = await axios.post(`${AI_URL}/ai/classify`, { text });
            return response.data;
        } catch (error) {
            console.error('Kategori tahmin edilemedi:', error);
            throw error;
        }
    },
};

export default api; 