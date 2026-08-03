package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.BookRequest;
import com.kshitiz.librarymanagementsystem.dto.BookResponse;
import com.kshitiz.librarymanagementsystem.entity.Book;
import com.kshitiz.librarymanagementsystem.service.BookService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PostMapping
    public ResponseEntity<String> addBook(@Valid @RequestBody BookRequest request, Authentication auth) {
        return new ResponseEntity<>(bookService.addBook(request, auth.getName()), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<BookResponse>> getAllBooks() {
        return new ResponseEntity<>(bookService.getAllBooks(), HttpStatus.OK);
    }

    // Publisher's own catalog — used by the Publisher "My Books" screen
    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @GetMapping("/mine")
    public ResponseEntity<List<BookResponse>> getMyBooks(Authentication auth) {
        return new ResponseEntity<>(bookService.getBooksByOwner(auth.getName()), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponse> getBookById(@PathVariable int id) {
        return new ResponseEntity<>(bookService.getBookById(id), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBook(@PathVariable int id, @Valid @RequestBody BookRequest request, Authentication auth) {
        return new ResponseEntity<>(bookService.updateBook(id, request, auth.getName()), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBook(@PathVariable int id, Authentication auth) {
        return new ResponseEntity<>(bookService.deleteBook(id, auth.getName()), HttpStatus.OK);
    }

    @GetMapping("/author/{authorName}")
    public List<Book> getBooksByAuthor(@PathVariable String authorName) {
        return bookService.findBooksByAuthorName(authorName);
    }

    @GetMapping("/search")
    public List<BookResponse> searchBooks(@RequestParam String title) {
        return bookService.searchBooksByTitle(title);
    }

    @GetMapping("/category/{categoryName}")
    public List<com.kshitiz.librarymanagementsystem.dto.BookResponse> getBooksByCategory(@PathVariable String categoryName) {
        return bookService.findBooksByCategory(categoryName);
    }

    @GetMapping("/pages/{pages}")
    public List<Book> getBooksWithPagesGreaterThan(@PathVariable int pages) {
        return bookService.findBooksWithPagesGreaterThan(pages);
    }

    @GetMapping("/native-search")
    public List<Book> searchBooksNative(@RequestParam String title) {
        return bookService.searchBooksByTitleNative(title);
    }

    @GetMapping("/page")
    public Page<BookResponse> getBooksWithPaginationAndSorting(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return bookService.getBooksWithPaginationAndSorting(page, size, sortBy, direction);
    }

    @GetMapping("/dynamic-search")
    public List<Book> searchBooksDynamic(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String category) {
        return bookService.searchBooksDynamic(title, author, category);
    }

    // Update book content (for book reader)
    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PatchMapping("/{id}/content")
    public ResponseEntity<String> updateContent(
            @PathVariable int id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        return new ResponseEntity<>(bookService.updateContent(id, body.get("content"), auth.getName()), HttpStatus.OK);
    }
}
