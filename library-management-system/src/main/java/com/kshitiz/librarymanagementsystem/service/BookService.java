package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.BookRequest;
import com.kshitiz.librarymanagementsystem.dto.BookResponse;
import com.kshitiz.librarymanagementsystem.entity.Author;
import com.kshitiz.librarymanagementsystem.entity.Book;
import com.kshitiz.librarymanagementsystem.entity.Category;
import com.kshitiz.librarymanagementsystem.entity.User;
import com.kshitiz.librarymanagementsystem.entity.enums.Role;
import com.kshitiz.librarymanagementsystem.exception.BookNotFoundException;
import com.kshitiz.librarymanagementsystem.repository.AuthorRepository;
import com.kshitiz.librarymanagementsystem.repository.BookRepository;
import com.kshitiz.librarymanagementsystem.repository.CategoryRepository;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import com.kshitiz.librarymanagementsystem.specification.BookSpecification;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.*;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository,
                        CategoryRepository categoryRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    /** Publishers may only touch their own books; the admin can touch anything. */
    private void assertCanModify(Book book, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail).orElse(null);
        if (requester == null) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unknown user");
        if (requester.getRole() == Role.ADMIN) return; // admin can edit anything
        if (book.getOwner() == null || !book.getOwner().getId().equals(requester.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage books you published");
        }
    }

    public String addBook(BookRequest request, String requesterEmail) {
        Optional<Author> optionalAuthor = authorRepository.findById(request.getAuthorId());
        if (optionalAuthor.isEmpty()) return "Author Not Found";

        User owner = userRepository.findByEmail(requesterEmail).orElse(null);

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        Book book = new Book();
        book.setTitle(request.getTitle());
        book.setAuthor(optionalAuthor.get());
        book.setCategories(categories);
        book.setAvailableCopies(request.getAvailableCopies() > 0 ? request.getAvailableCopies() : 1);
        book.setPrice(request.getPrice());
        book.setOwner(owner);
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());
        if (request.getContent() != null) book.setContent(request.getContent());
        bookRepository.save(book);
        return "Book Added Successfully";
    }

    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    /** Books published by a specific user — used for the publisher's "My Books" view. */
    public List<BookResponse> getBooksByOwner(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail).orElse(null);
        if (owner == null) return List.of();
        return bookRepository.findAll().stream()
                .filter(b -> b.getOwner() != null && b.getOwner().getId().equals(owner.getId()))
                .map(this::mapToResponse)
                .toList();
    }

    public BookResponse getBookById(int id) {
        return bookRepository.findById(id).map(this::mapToResponse)
                .orElseThrow(() -> new BookNotFoundException("Book not found with id: " + id));
    }

    public String updateBook(int id, BookRequest request, String requesterEmail) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isEmpty()) return "Book Not Found";
        Book book = optionalBook.get();
        assertCanModify(book, requesterEmail);

        Optional<Author> optionalAuthor = authorRepository.findById(request.getAuthorId());
        if (optionalAuthor.isEmpty()) return "Author Not Found";

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
        book.setTitle(request.getTitle());
        book.setAuthor(optionalAuthor.get());
        book.setCategories(categories);
        if (request.getAvailableCopies() > 0) book.setAvailableCopies(request.getAvailableCopies());
        book.setPrice(request.getPrice());
        if (request.getImageUrl() != null) book.setImageUrl(request.getImageUrl());
        if (request.getContent() != null) book.setContent(request.getContent());
        bookRepository.save(book);
        return "Book Updated Successfully";
    }

    public String deleteBook(int id, String requesterEmail) {
        Optional<Book> optionalBook = bookRepository.findById(id);
        if (optionalBook.isEmpty()) return "Book Not Found";
        assertCanModify(optionalBook.get(), requesterEmail);
        bookRepository.deleteById(id);
        return "Book Deleted Successfully";
    }

    public String updateContent(int id, String content, String requesterEmail) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException("Book not found"));
        assertCanModify(book, requesterEmail);
        book.setContent(content);
        bookRepository.save(book);
        return "Content updated successfully";
    }

    public List<Book> findBooksByAuthorName(String name) { return bookRepository.findBooksByAuthorName(name); }
    public List<BookResponse> searchBooksByTitle(String title) { return bookRepository.searchBooksByTitle(title).stream().map(this::mapToResponse).toList(); }
    public List<BookResponse> findBooksByCategory(String cat) {
        return bookRepository.findBooksByCategory(cat).stream().map(this::mapToResponse).toList();
    }
    public List<Book> findBooksWithPagesGreaterThan(int p) { return bookRepository.findBooksWithPagesGreaterThan(p); }
    public List<Book> searchBooksByTitleNative(String t) { return bookRepository.searchBooksByTitleNative(t); }

    public Page<BookResponse> getBooksWithPaginationAndSorting(int page, int size, String sortBy, String dir) {
        Sort sort = dir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return bookRepository.findAll(PageRequest.of(page, size, sort)).map(this::mapToResponse);
    }

    public List<Book> searchBooksDynamic(String title, String author, String category) {
        Specification<Book> spec = Specification.allOf();
        if (title != null && !title.isEmpty()) spec = spec.and(BookSpecification.hasTitle(title));
        if (author != null && !author.isEmpty()) spec = spec.and(BookSpecification.hasAuthor(author));
        if (category != null && !category.isEmpty()) spec = spec.and(BookSpecification.hasCategory(category));
        return bookRepository.findAll(spec);
    }

    private BookResponse mapToResponse(Book book) {
        List<String> cats = new ArrayList<>();
        for (Category c : book.getCategories()) cats.add(c.getName());
        BookResponse r = new BookResponse(book.getId(), book.getTitle(),
                book.getAuthor().getName(), cats,
                book.getAvailableCopies() != null ? book.getAvailableCopies() : 0,
                book.getImageUrl());
        r.setContent(book.getContent());
        r.setPrice(book.getPrice() != null ? book.getPrice() : 0.0);
        if (book.getOwner() != null) {
            r.setOwnerId(book.getOwner().getId());
            r.setOwnerName(book.getOwner().getName());
            r.setOwnerUpiId(book.getOwner().getUpiId());
            r.setOwnerQrImageUrl(book.getOwner().getQrImageUrl());
        }
        return r;
    }
}
