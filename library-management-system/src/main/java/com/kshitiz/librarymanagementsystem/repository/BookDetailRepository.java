package com.kshitiz.librarymanagementsystem.repository;

import com.kshitiz.librarymanagementsystem.entity.BookDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookDetailRepository extends JpaRepository<BookDetail, Integer> {
}