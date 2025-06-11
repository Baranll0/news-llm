package com.newsai.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "news")
public class News {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String spot;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 500)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String image;

    @ElementCollection
    @CollectionTable(name = "news_positions", joinColumns = @JoinColumn(name = "news_id"))
    @Column(name = "position")
    private List<String> positions;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime publishDate;

    @Column(nullable = false, length = 50)
    private String status = "published";

    @Column(nullable = false)
    private Long views = 0L;

    @Override
    public String toString() {
        return "News{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", spot='" + spot + '\'' +
                ", content='" + content + '\'' +
                ", category='" + category + '\'' +
                ", summary='" + summary + '\'' +
                ", image='" + image + '\'' +
                ", createdAt=" + createdAt +
                ", publishDate=" + publishDate +
                ", status='" + status + '\'' +
                ", views=" + views +
                '}';
    }
} 