import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddNews() {
    const [news, setNews] = useState({
        title: '',
        spot: '',
        content: '',
        category: '',
        summary: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNews(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/news', news);
            alert('Haber başarıyla eklendi!');
            navigate('/');
        } catch (error) {
            console.error('Haber eklenirken hata oluştu:', error);
            alert('Haber eklenirken bir hata oluştu.');
        }
    };

    return (
        <div className="container mt-4">
            <h2>Yeni Haber Ekle</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Başlık</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        value={news.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Spot</label>
                    <input
                        type="text"
                        className="form-control"
                        name="spot"
                        value={news.spot}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">İçerik</label>
                    <textarea
                        className="form-control"
                        name="content"
                        value={news.content}
                        onChange={handleChange}
                        rows="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Kategori</label>
                    <select
                        className="form-control"
                        name="category"
                        value={news.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Kategori Seçin</option>
                        <option value="Teknoloji">Teknoloji</option>
                        <option value="Spor">Spor</option>
                        <option value="Ekonomi">Ekonomi</option>
                        <option value="Siyaset">Siyaset</option>
                        <option value="Kültür-Sanat">Kültür-Sanat</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label className="form-label">Özet</label>
                    <textarea
                        className="form-control"
                        name="summary"
                        value={news.summary}
                        onChange={handleChange}
                        rows="3"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Haber Ekle</button>
            </form>
        </div>
    );
}

export default AddNews; 