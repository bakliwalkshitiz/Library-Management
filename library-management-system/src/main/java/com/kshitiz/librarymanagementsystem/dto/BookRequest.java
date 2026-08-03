package com.kshitiz.librarymanagementsystem.dto;

import jakarta.validation.constraints.*;
import java.util.List;

public class BookRequest {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 2, max = 100)
    private String title;

    @NotNull(message = "Author Id is required")
    private Integer authorId;

    @NotNull(message = "Category Ids are required")
    private List<Integer> categoryIds;

    private int availableCopies = 1;
    private String imageUrl;
    private String content;
    private double price = 0.0;

    public BookRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getAuthorId() { return authorId; }
    public void setAuthorId(Integer authorId) { this.authorId = authorId; }
    public List<Integer> getCategoryIds() { return categoryIds; }
    public void setCategoryIds(List<Integer> categoryIds) { this.categoryIds = categoryIds; }
    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
