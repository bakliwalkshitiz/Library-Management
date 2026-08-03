package com.kshitiz.librarymanagementsystem.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.kshitiz.librarymanagementsystem.entity.Book;
import java.util.List;

@Repository
public interface BookRepository extends
        JpaRepository<Book, Integer>,
        JpaSpecificationExecutor<Book> {

    @Query("SELECT b FROM Book b WHERE b.author.name = :authorName")
    List<Book> findBooksByAuthorName(String authorName);

    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Book> searchBooksByTitle(String title);

    @Query("SELECT DISTINCT b FROM Book b JOIN b.categories c WHERE LOWER(c.name) = LOWER(:categoryName)")
    List<Book> findBooksByCategory(@org.springframework.data.repository.query.Param("categoryName") String categoryName);

    @Query("SELECT b FROM Book b WHERE b.bookDetail.pages > :pages")
    List<Book> findBooksWithPagesGreaterThan(int pages);

    @Query(
            value = "SELECT * FROM books WHERE book_title LIKE %:title%",
            nativeQuery = true
    )
    List<Book> searchBooksByTitleNative(String title);
}