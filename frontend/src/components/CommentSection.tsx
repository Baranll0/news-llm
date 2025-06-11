import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, Divider } from '@mui/material';
import { Send } from '@mui/icons-material';

interface Comment {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
}

interface CommentSectionProps {
  newsId: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ newsId }) => {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: {
        name: "Kullanıcı 1",
        avatar: "https://via.placeholder.com/32x32"
      },
      content: "Bu haber çok ilginç!",
      timestamp: "1 saat önce",
      likes: 5
    }
  ]);

  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      author: {
        name: "Mevcut Kullanıcı",
        avatar: "https://via.placeholder.com/32x32"
      },
      content: newComment,
      timestamp: "Şimdi",
      likes: 0
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Yorumlar
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Yorumunuzu yazın..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<Send />}
          >
            Gönder
          </Button>
        </Box>
      </form>

      {comments.map((comment) => (
        <Box key={comment.id} sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar 
              src={comment.author.avatar} 
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Box>
              <Typography variant="subtitle2">
                {comment.author.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {comment.timestamp}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ ml: 4 }}>
            {comment.content}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, ml: 4, mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {comment.likes} beğeni
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Yanıtla
            </Typography>
          </Box>
          
          <Divider sx={{ mt: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default CommentSection; 