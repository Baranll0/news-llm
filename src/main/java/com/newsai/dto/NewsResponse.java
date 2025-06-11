package com.newsai.dto;

import lombok.Data;
import java.util.List;

@Data
public class NewsResponse {
    private Long id;
    private String title;
    private String spot;
    private String content;
    private String category;
    private String summary;
    private String image;
    private String createdAt;
    private String publishDate;
    private String status;
    private Long views;
    private List<String> positions;
} 