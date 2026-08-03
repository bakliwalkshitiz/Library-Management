package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.BorrowRequest;
import com.kshitiz.librarymanagementsystem.dto.BorrowResponse;
import com.kshitiz.librarymanagementsystem.entity.Book;
import com.kshitiz.librarymanagementsystem.entity.BorrowRecord;
import com.kshitiz.librarymanagementsystem.entity.User;
import com.kshitiz.librarymanagementsystem.entity.enums.Role;
import com.kshitiz.librarymanagementsystem.repository.BookRepository;
import com.kshitiz.librarymanagementsystem.repository.BorrowRecordRepository;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BorrowRecordService {

    private static final Logger logger = LoggerFactory.getLogger(BorrowRecordService.class);

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BorrowRecordService(BorrowRecordRepository borrowRecordRepository, BookRepository bookRepository, UserRepository userRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    public BorrowResponse borrowBook(BorrowRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        boolean alreadyBorrowed = borrowRecordRepository.findAll().stream()
                .anyMatch(r -> r.getBook() != null
                        && r.getBook().getId() == book.getId()
                        && !r.isReturned()
                        && r.getBorrowerName().equalsIgnoreCase(request.getBorrowerName()));
        if (alreadyBorrowed) {
            throw new RuntimeException("You already have this book issued");
        }

        // FIX: If availableCopies is null, treat as 1 (default)
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(1);
        }

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available - all copies are issued");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = new BorrowRecord();
        record.setBorrowerName(request.getBorrowerName());
        record.setBorrowDate(java.time.LocalDate.now());
        record.setReturnDate(java.time.LocalDate.now().plusDays(14));
        record.setBook(book);
        record.setReturned(false);
        record.setPricePaid(book.getPrice() != null ? book.getPrice() : 0.0);

        BorrowRecord savedRecord = borrowRecordRepository.save(record);
        logger.info("Book borrowed: {} by {}", savedRecord.getBook().getTitle(), savedRecord.getBorrowerName());

        BorrowResponse response = new BorrowResponse();
        response.setId(savedRecord.getId());
        response.setBookId(savedRecord.getBook().getId());
        response.setBorrowerName(savedRecord.getBorrowerName());
        response.setBookTitle(savedRecord.getBook().getTitle());
        response.setBorrowDate(savedRecord.getBorrowDate());
        response.setReturnDate(savedRecord.getReturnDate());
        response.setReturned(savedRecord.isReturned());
        response.setPricePaid(savedRecord.getPricePaid());
        return response;
    }

    public List<BorrowResponse> getAllBorrowRecords(String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail).orElse(null);
        List<BorrowRecord> all = borrowRecordRepository.findAll();

        if (requester == null) return List.of();

        if (requester.getRole() == Role.ADMIN) {
            return all.stream().map(this::mapToResponse).toList();
        }
        if (requester.getRole() == Role.PUBLISHER) {
            return all.stream()
                    .filter(r -> r.getBook() != null && r.getBook().getOwner() != null
                            && r.getBook().getOwner().getId().equals(requester.getId()))
                    .map(this::mapToResponse)
                    .toList();
        }
        // Regular reader — only their own borrow history
        return all.stream()
                .filter(r -> r.getBorrowerName() != null && r.getBorrowerName().equalsIgnoreCase(requester.getName()))
                .map(this::mapToResponse)
                .toList();
    }

    private BorrowResponse mapToResponse(BorrowRecord record) {
        BorrowResponse response = new BorrowResponse();
        response.setId(record.getId());
        response.setBookId(record.getBook() != null ? record.getBook().getId() : null);
        response.setBorrowerName(record.getBorrowerName());
        response.setBookTitle(record.getBook() != null ? record.getBook().getTitle() : "Unknown");
        response.setBorrowDate(record.getBorrowDate());
        response.setReturnDate(record.getReturnDate());
        response.setReturned(record.isReturned());
        response.setPricePaid(record.getPricePaid());
        return response;
    }

    public String returnBook(int id, String requesterEmail) {
        BorrowRecord record = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found"));

        User requester = userRepository.findByEmail(requesterEmail).orElse(null);
        if (requester == null) throw new RuntimeException("Unknown user");

        boolean isAdmin = requester.getRole() == Role.ADMIN;
        boolean isOwningPublisher = requester.getRole() == Role.PUBLISHER
                && record.getBook() != null && record.getBook().getOwner() != null
                && record.getBook().getOwner().getId().equals(requester.getId());
        boolean isBorrowerThemself = record.getBorrowerName() != null
                && record.getBorrowerName().equalsIgnoreCase(requester.getName());

        if (!isAdmin && !isOwningPublisher && !isBorrowerThemself) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.FORBIDDEN, "You can't modify this borrow record");
        }

        if (record.isReturned()) {
            return "Book was already returned";
        }

        Book book = record.getBook();
        if (book.getAvailableCopies() == null) book.setAvailableCopies(0);
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        record.setReturned(true);
        borrowRecordRepository.save(record);
        return "Book returned successfully";
    }
}
