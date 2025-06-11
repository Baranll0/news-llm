package com.newsai.controller;

import com.newsai.dto.NewsRequest;
import com.newsai.dto.NewsResponse;
import com.newsai.model.News;
import com.newsai.service.NewsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NewsController {

    private static final Logger logger = LoggerFactory.getLogger(NewsController.class);

    @Autowired
    private NewsService newsService;

    @Value("${upload.path}")
    private String uploadPath;

    @PostMapping("/news/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String imageUrl = newsService.uploadImage(file);
            return ResponseEntity.ok(imageUrl);
        } catch (Exception e) {
            logger.error("Görsel yüklenirken hata oluştu: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Görsel yüklenemedi: " + e.getMessage());
        }
    }

    @GetMapping("/news")
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/news/{id}")
    public News getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id);
    }

    @GetMapping("/news/category/{category}")
    public List<News> getNewsByCategory(@PathVariable String category) {
        return newsService.getNewsByCategory(category);
    }

    @PostMapping("/news")
    public ResponseEntity<NewsResponse> createNews(@RequestBody NewsRequest request) {
        try {
            NewsResponse response = newsService.createNews(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Haber oluşturulurken hata: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PutMapping("/news/{id}")
    public News updateNews(@PathVariable Long id, @RequestBody News newsDetails) {
        return newsService.updateNews(id, newsDetails);
    }

    @DeleteMapping("/news/{id}")
    public void deleteNews(@PathVariable Long id) {
        newsService.deleteNews(id);
    }
} 