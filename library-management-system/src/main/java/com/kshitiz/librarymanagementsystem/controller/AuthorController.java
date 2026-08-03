package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.AuthorRequest;
import com.kshitiz.librarymanagementsystem.dto.AuthorResponse;
import com.kshitiz.librarymanagementsystem.service.AuthorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/authors")
public class AuthorController {

    private final AuthorService authorService;

    public AuthorController(AuthorService authorService) {
        this.authorService = authorService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PostMapping
    public ResponseEntity<String> addAuthor(@Valid @RequestBody AuthorRequest request) {

        return new ResponseEntity<>(
                authorService.addAuthor(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<AuthorResponse>> getAllAuthors() {

        return new ResponseEntity<>(
                authorService.getAllAuthors(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuthorResponse> getAuthorById(@PathVariable int id) {

        return new ResponseEntity<>(
                authorService.getAuthorById(id),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAuthor(
            @PathVariable int id,
            @Valid @RequestBody AuthorRequest request) {

        return new ResponseEntity<>(
                authorService.updateAuthor(id, request),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAuthor(@PathVariable int id) {

        return new ResponseEntity<>(
                authorService.deleteAuthor(id),
                HttpStatus.OK
        );
    }
}