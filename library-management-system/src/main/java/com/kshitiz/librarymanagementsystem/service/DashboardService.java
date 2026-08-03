package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.DashboardResponse;
import com.kshitiz.librarymanagementsystem.repository.AuthorRepository;
import com.kshitiz.librarymanagementsystem.repository.BookRepository;
import com.kshitiz.librarymanagementsystem.repository.BorrowRecordRepository;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public DashboardService(
            BookRepository bookRepository,
            AuthorRepository authorRepository,
            UserRepository userRepository,
            BorrowRecordRepository borrowRecordRepository) {

        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.userRepository = userRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    public DashboardResponse getDashboard() {

        return new DashboardResponse(
                bookRepository.count(),
                authorRepository.count(),
                userRepository.count(),
                borrowRecordRepository.count()
        );
    }
}