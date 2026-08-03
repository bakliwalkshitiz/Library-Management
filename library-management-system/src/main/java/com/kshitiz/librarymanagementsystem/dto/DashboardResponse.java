package com.kshitiz.librarymanagementsystem.dto;

public class DashboardResponse {

    private long books;
    private long authors;
    private long users;
    private long borrowed;

    public DashboardResponse() {}

    public DashboardResponse(long books, long authors, long users, long borrowed) {
        this.books = books;
        this.authors = authors;
        this.users = users;
        this.borrowed = borrowed;
    }

    public long getBooks() {
        return books;
    }

    public void setBooks(long books) {
        this.books = books;
    }

    public long getAuthors() {
        return authors;
    }

    public void setAuthors(long authors) {
        this.authors = authors;
    }

    public long getUsers() {
        return users;
    }

    public void setUsers(long users) {
        this.users = users;
    }

    public long getBorrowed() {
        return borrowed;
    }

    public void setBorrowed(long borrowed) {
        this.borrowed = borrowed;
    }
}