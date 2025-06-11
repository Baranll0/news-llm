import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import styled from 'styled-components';
import api from '../services/api';
import { News } from '../types/News';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f5f5f5;
  overflow: hidden;
`;

const Card = styled(animated.div)`
  position: absolute;
  width: 90%;
  max-width: 400px;
  height: 70vh;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  cursor: grab;
`;

const NewsImage = styled.img`
  width: 100%;
  height: 50%;
  object-fit: cover;
  border-radius: 15px;
`;

const NewsTitle = styled.h2`
  margin: 15px 0;
  font-size: 1.5rem;
  color: #333;
`;

const NewsDescription = styled.p`
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
  overflow-y: auto;
`;

const defaultImages: Record<string, string> = {
  guncel: '/default-images/sondakika.jpg',
  spor: '/default-images/spor.jpg',
  ekonomi: '/default-images/ekonomi.jpg',
  turkiye: '/default-images/turkiye.jpg',
  dunya: '/default-images/dunya.jpg',
  teknoloji: '/default-images/teknoloji.jpg',
  genel: '/default-images/genel.jpg',
};

const getImageUrl = (image: string | null | undefined, category?: string) => {
  if (image && image.startsWith('http')) return image;
  if (image && image.startsWith('/uploads/')) return `http://localhost:8080${image}`;
  if (category && defaultImages[category.toLowerCase()]) return defaultImages[category.toLowerCase()];
  return 'https://via.placeholder.com/400x300';
};

const NewsReels: React.FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeAction, setSwipeAction] = useState<'none' | 'right' | 'left'>('none');
  const navigate = useNavigate();
  const springRef = useRef<any>();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await api.getAllNews();
        setNews(data);
      } catch (error) {
        console.error('Reels haberleri alınamadı:', error);
      }
    };
    fetchNews();
  }, []);

  const currentCard = news[currentIndex];

  const [{ x, y, rotate }, apiSpring] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    config: { tension: 500, friction: 50 },
    onRest: () => {
      if (swipeAction === 'right') {
        setCurrentIndex((prev) => (prev + 1) % news.length);
        setSwipeAction('none');
        apiSpring.set({ x: 0, y: 0, rotate: 0 });
      } else if (swipeAction === 'left') {
        if (currentCard) {
          setSwipeAction('none');
          apiSpring.set({ x: 0, y: 0, rotate: 0 });
          navigate(`/${currentCard.category}/${currentCard.id}`);
        }
      }
    }
  }));

  // Swipe trigger mesafesi
  const SWIPE_TRIGGER_DISTANCE = 0.25; // Ekranın %25'i kadar kaydırınca aksiyon

  const bind = useGesture({
    onDragEnd: ({ movement: [mx], direction: [xDir] }) => {
      const width = window.innerWidth;
      if (Math.abs(mx) > width * SWIPE_TRIGGER_DISTANCE) {
        if (xDir > 0) {
          // Sağa kaydır: Kartı animasyonla sağa çıkar, sonra index artır
          setSwipeAction('right');
          apiSpring.start({ x: width, y: 0, rotate: 20 });
        } else if (xDir < 0) {
          // Sola kaydır: Kartı animasyonla sola çıkar, sonra detay sayfasına git
          setSwipeAction('left');
          apiSpring.start({ x: -width, y: 0, rotate: -20 });
        }
      } else {
        // Yeterli mesafe yoksa kartı ortaya geri getir
        apiSpring.start({ x: 0, y: 0, rotate: 0 });
      }
    },
    onDrag: ({ down, movement: [mx, my] }) => {
      // Sürüklerken kartı hareket ettir
      apiSpring.start({ x: down ? mx : 0, y: down ? my : 0, rotate: down ? mx / 20 : 0 });
    },
  });

  if (!currentCard) return null;

  return (
    <Container>
      <Card
        {...bind()}
        style={{
          x,
          y,
          rotate,
        }}
      >
        <NewsImage src={getImageUrl(currentCard.image, currentCard.category)} alt={currentCard.title} />
        <NewsTitle>{currentCard.title}</NewsTitle>
        <NewsDescription>{currentCard.spot || currentCard.summary || currentCard.content?.slice(0, 120) + '...'}</NewsDescription>
      </Card>
    </Container>
  );
};

export default NewsReels; 