package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.BookDetailRequest;
import com.kshitiz.librarymanagementsystem.dto.BookDetailResponse;
import com.kshitiz.librarymanagementsystem.entity.Book;
import com.kshitiz.librarymanagementsystem.entity.BookDetail;
import com.kshitiz.librarymanagementsystem.repository.BookDetailRepository;
import com.kshitiz.librarymanagementsystem.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BookDetailService {

    private static final Logger logger =
            LoggerFactory.getLogger(BookDetailService.class);

    private final BookDetailRepository bookDetailRepository;
    private final BookRepository bookRepository;

    public BookDetailService(BookDetailRepository bookDetailRepository,
                             BookRepository bookRepository) {
        this.bookDetailRepository = bookDetailRepository;
        this.bookRepository = bookRepository;
    }

    public String addBookDetail(BookDetailRequest request) {

        Optional<Book> optionalBook =
                bookRepository.findById(request.getBookId());

        if (optionalBook.isEmpty()) {
            return "Book Not Found";
        }

        BookDetail detail = new BookDetail();

        detail.setIsbn(request.getIsbn());
        detail.setPages(request.getPages());
        detail.setPublisher(request.getPublisher());
        detail.setLanguage(request.getLanguage());
        detail.setBook(optionalBook.get());

        bookDetailRepository.save(detail);

        return "Book Detail Added Successfully";
    }

    public List<BookDetailResponse> getAllBookDetails() {

        List<BookDetail> details = bookDetailRepository.findAll();

        List<BookDetailResponse> response = new ArrayList<>();

        for (BookDetail detail : details) {

            response.add(
                    new BookDetailResponse(
                            detail.getId(),
                            detail.getIsbn(),
                            detail.getPages(),
                            detail.getPublisher(),
                            detail.getLanguage(),
                            detail.getBook().getTitle()
                    )
            );
        }

        return response;
    }
}