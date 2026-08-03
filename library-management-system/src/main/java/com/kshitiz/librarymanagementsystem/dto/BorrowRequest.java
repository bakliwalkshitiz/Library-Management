package com.kshitiz.librarymanagementsystem.dto;

public class BorrowRequest {

    private Integer bookId;
    private String borrowerName;

    public BorrowRequest() {
    }

    public Integer getBookId() {
        return bookId;
    }

    public void setBookId(Integer bookId) {
        this.bookId = bookId;
    }

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }
}