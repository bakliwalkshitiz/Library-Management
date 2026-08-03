package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.BorrowRequest;
import com.kshitiz.librarymanagementsystem.dto.BorrowResponse;
import com.kshitiz.librarymanagementsystem.service.BorrowRecordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/borrow")
public class BorrowRecordController {

    private final BorrowRecordService borrowRecordService;

    public BorrowRecordController(BorrowRecordService borrowRecordService) {
        this.borrowRecordService = borrowRecordService;
    }

    @PostMapping
    public BorrowResponse borrowBook(@RequestBody BorrowRequest request) {
        return borrowRecordService.borrowBook(request);
    }

    @GetMapping
    public java.util.List<com.kshitiz.librarymanagementsystem.dto.BorrowResponse> getAllBorrowRecords(org.springframework.security.core.Authentication auth) {
        return borrowRecordService.getAllBorrowRecords(auth.getName());
    }

    @DeleteMapping("/{id}")
    public String returnBook(@PathVariable int id, org.springframework.security.core.Authentication auth) {
        return borrowRecordService.returnBook(id, auth.getName());
    }
}
