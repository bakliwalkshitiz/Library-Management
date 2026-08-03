package com.kshitiz.librarymanagementsystem.repository;

import com.kshitiz.librarymanagementsystem.entity.Author;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Integer> {
    java.util.Optional<Author> findByEmail(String email);
    boolean existsByEmail(String email);
}