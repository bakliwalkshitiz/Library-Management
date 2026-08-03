package com.kshitiz.librarymanagementsystem.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "book_details")
public class BookDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true)
    private String isbn;

    private int pages;

    private String publisher;

    private String language;

    @OneToOne
    @JoinColumn(name = "book_id", unique = true)
    private Book book;

    public BookDetail() {
    }

    public BookDetail(int id, String isbn, int pages,
                      String publisher,
                      String language,
                      Book book) {
        this.id = id;
        this.isbn = isbn;
        this.pages = pages;
        this.publisher = publisher;
        this.language = language;
        this.book = book;
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

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }
}