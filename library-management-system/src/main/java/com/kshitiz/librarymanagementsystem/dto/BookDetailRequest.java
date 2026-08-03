package com.kshitiz.librarymanagementsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BookDetailRequest {

    @NotBlank
    private String isbn;

    @NotNull
    private Integer pages;

    @NotBlank
    private String publisher;

    @NotBlank
    private String language;

    @NotNull
    private Integer bookId;

    public BookDetailRequest() {}

    public BookDetailRequest(String isbn, Integer pages, String publisher,
                             String language, Integer bookId) {
        this.isbn = isbn;
        this.pages = pages;
        this.publisher = publisher;
        this.language = language;
        this.bookId = bookId;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Integer getPages() {
        return pages;
    }

    public void setPages(Integer pages) {
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

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }
}