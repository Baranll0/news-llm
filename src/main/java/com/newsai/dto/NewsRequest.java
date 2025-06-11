package com.newsai.dto;

import lombok.Data;
import java.util.List;

@Data
public class NewsRequest {
    private String title;
    private String spot;
    private String content;
    private String category;
    private String summary;
    private String image;
    private String status;
    private List<String> positions;

    @Override
    public String toString() {
        return "NewsRequest{" +
                "title='" + title + '\'' +
                ", spot='" + spot + '\'' +
                ", content='" + content + '\'' +
                ", category='" + category + '\'' +
                ", summary='" + summary + '\'' +
                ", image='" + image + '\'' +
                ", status='" + status + '\'' +
                ", positions=" + positions +
                '}';
    }
} 