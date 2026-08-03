package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.AuthorRequest;
import com.kshitiz.librarymanagementsystem.dto.AuthorResponse;
import com.kshitiz.librarymanagementsystem.entity.Author;
import com.kshitiz.librarymanagementsystem.repository.AuthorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthorService {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthorService.class);

    private final AuthorRepository authorRepository;

    public AuthorService(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    public String addAuthor(AuthorRequest request) {
        String cleanEmail = (request.getEmail() != null && !request.getEmail().isBlank()) ? request.getEmail().trim() : null;

        if (cleanEmail != null && authorRepository.existsByEmail(cleanEmail)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.CONFLICT, "Author with email '" + cleanEmail + "' already exists");
        }

        Author author = new Author();
        author.setName(request.getName());
        author.setEmail(cleanEmail);

        authorRepository.save(author);

        return "Author Added Successfully";
    }

    public List<AuthorResponse> getAllAuthors() {

        List<Author> authors = authorRepository.findAll();

        List<AuthorResponse> response = new ArrayList<>();

        for (Author author : authors) {

            response.add(
                    new AuthorResponse(
                            author.getId(),
                            author.getName(),
                            author.getEmail()
                    )
            );
        }

        return response;
    }

    public AuthorResponse getAuthorById(int id) {

        Optional<Author> optionalAuthor = authorRepository.findById(id);

        if (optionalAuthor.isPresent()) {

            Author author = optionalAuthor.get();

            return new AuthorResponse(
                    author.getId(),
                    author.getName(),
                    author.getEmail()
            );
        }

        return null;
    }

    public String updateAuthor(int id, AuthorRequest request) {

        Optional<Author> optionalAuthor = authorRepository.findById(id);

        if (optionalAuthor.isPresent()) {

            Author author = optionalAuthor.get();

            author.setName(request.getName());
            author.setEmail(request.getEmail());

            authorRepository.save(author);

            return "Author Updated Successfully";
        }

        return "Author Not Found";
    }

    public String deleteAuthor(int id) {

        if (authorRepository.existsById(id)) {

            authorRepository.deleteById(id);

            return "Author Deleted Successfully";
        }

        return "Author Not Found";
    }
}