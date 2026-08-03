package com.kshitiz.librarymanagementsystem.dto;

import java.util.List;

public class BookResponse {

    private int id;
    private String title;
    private String authorName;
    private List<String> categories;
    private int availableCopies;
    private String imageUrl;
    private String content;
    private double price;
    private Integer ownerId;
    private String ownerName;
    private String ownerUpiId;
    private String ownerQrImageUrl;

    public BookResponse() {}

    public BookResponse(int id, String title, String authorName, List<String> categories, int availableCopies, String imageUrl) {
        this.id = id;
        this.title = title;
        this.authorName = authorName;
        this.categories = categories;
        this.availableCopies = availableCopies;
        this.imageUrl = imageUrl;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }
    public int getAvailableCopies() { return availableCopies; }
    public void setAvailableCopies(int availableCopies) { this.availableCopies = availableCopies; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public Integer getOwnerId() { return ownerId; }
    public void setOwnerId(Integer ownerId) { this.ownerId = ownerId; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getOwnerUpiId() { return ownerUpiId; }
    public void setOwnerUpiId(String ownerUpiId) { this.ownerUpiId = ownerUpiId; }
    public String getOwnerQrImageUrl() { return ownerQrImageUrl; }
    public void setOwnerQrImageUrl(String ownerQrImageUrl) { this.ownerQrImageUrl = ownerQrImageUrl; }
}
