package com.newsai.service;

import com.newsai.dto.NewsRequest;
import com.newsai.dto.NewsResponse;
import com.newsai.model.News;
import com.newsai.repository.NewsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NewsService {
    
    private static final Logger logger = LoggerFactory.getLogger(NewsService.class);
    
    @Autowired
    private NewsRepository newsRepository;

    @Value("${upload.path}")
    private String uploadPath;

    public List<News> getAllNews() {
        return newsRepository.findAllByOrderByCreatedAtDesc();
    }

    public News getNewsById(Long id) {
        return newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Haber bulunamadı: " + id));
    }

    public List<News> getNewsByCategory(String category) {
        return newsRepository.findByCategory(category);
    }

    public NewsResponse createNews(NewsRequest request) {
        try {
            logger.info("Yeni haber oluşturuluyor: {}", request.getTitle());
            
            News news = new News();
            news.setTitle(request.getTitle());
            news.setSpot(request.getSpot());
            news.setContent(request.getContent());
            news.setCategory(request.getCategory());
            news.setSummary(request.getSummary());
            news.setImage(request.getImage());
            news.setPositions(request.getPositions() != null ? request.getPositions() : List.of("normal"));
            news.setCreatedAt(LocalDateTime.now());
            news.setPublishDate(LocalDateTime.now());
            news.setStatus("published");
            news.setViews(0L);

            news = newsRepository.save(news);
            logger.info("Haber başarıyla kaydedildi. ID: {}", news.getId());

            return convertToNewsResponse(news);
        } catch (Exception e) {
            logger.error("Haber kaydedilirken hata oluştu: {}", e.getMessage());
            throw new RuntimeException("Haber kaydedilemedi: " + e.getMessage());
        }
    }

    public News updateNews(Long id, News newsDetails) {
        News news = getNewsById(id);
        news.setTitle(newsDetails.getTitle());
        news.setSpot(newsDetails.getSpot());
        news.setContent(newsDetails.getContent());
        news.setCategory(newsDetails.getCategory());
        news.setSummary(newsDetails.getSummary());
        news.setPositions(newsDetails.getPositions());
        if (newsDetails.getImage() != null) {
            news.setImage(newsDetails.getImage());
        }
        if (newsDetails.getStatus() != null) {
            news.setStatus(newsDetails.getStatus());
        }
        return newsRepository.save(news);
    }

    public void deleteNews(Long id) {
        News news = getNewsById(id);
        newsRepository.delete(news);
    }

    public String uploadImage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get(uploadPath);
            
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            
            Path filePath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);
            
            return "/uploads/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Resim yüklenirken hata oluştu", e);
        }
    }

    private NewsResponse convertToNewsResponse(News news) {
        NewsResponse response = new NewsResponse();
        response.setId(news.getId());
        response.setTitle(news.getTitle());
        response.setSpot(news.getSpot());
        response.setContent(news.getContent());
        response.setCategory(news.getCategory());
        response.setSummary(news.getSummary());
        response.setImage(news.getImage());
        response.setPositions(news.getPositions());
        response.setCreatedAt(news.getCreatedAt().toString());
        response.setPublishDate(news.getPublishDate().toString());
        response.setStatus(news.getStatus());
        response.setViews(news.getViews());
        return response;
    }
} 