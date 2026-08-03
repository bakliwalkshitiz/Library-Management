package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.BookDetailRequest;
import com.kshitiz.librarymanagementsystem.dto.BookDetailResponse;
import com.kshitiz.librarymanagementsystem.service.BookDetailService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/book-details")
public class BookDetailController {

    private final BookDetailService bookDetailService;

    public BookDetailController(BookDetailService bookDetailService) {
        this.bookDetailService = bookDetailService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PostMapping
    public ResponseEntity<String> addBookDetail(
            @Valid @RequestBody BookDetailRequest request) {

        return new ResponseEntity<>(
                bookDetailService.addBookDetail(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<BookDetailResponse>> getAllBookDetails() {

        return new ResponseEntity<>(
                bookDetailService.getAllBookDetails(),
                HttpStatus.OK
        );
    }
}