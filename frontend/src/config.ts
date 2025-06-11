export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Debug için API URL'sini konsola yazdır
console.log('API URL:', API_URL);

// Uploads URL'sini doğru şekilde yapılandır
export const UPLOADS_URL = `${API_URL}`;

export {}; 