package com.kshitiz.librarymanagementsystem.dto;

public class BookDetailResponse {

    private int id;
    private String isbn;
    private int pages;
    private String publisher;
    private String language;
    private String bookTitle;

    public BookDetailResponse() {
    }

    public BookDetailResponse(int id, String isbn, int pages, String publisher, String language, String bookTitle) {
        this.id = id;
        this.isbn = isbn;
        this.pages = pages;
        this.publisher = publisher;
        this.language = language;
        this.bookTitle = bookTitle;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public int getPages() {
        return pages;
    }

    public void setPages(int pages) {
        this.pages = pages;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getBookTitle() {
        return bookTitle;
    }

    public void setBookTitle(String bookTitle) {
        this.bookTitle = bookTitle;
    }
}