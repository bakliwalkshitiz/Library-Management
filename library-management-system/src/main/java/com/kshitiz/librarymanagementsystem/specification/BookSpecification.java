package com.kshitiz.librarymanagementsystem.specification;


import org.springframework.data.jpa.domain.Specification;

import com.kshitiz.librarymanagementsystem.entity.Book;

public class BookSpecification {

    public static Specification<Book> hasTitle(String title) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("title")),
                        "%" + title.toLowerCase() + "%"
                );
    }
    public static Specification<Book> hasAuthor(String authorName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.get("author").get("name"),
                        authorName
                );
    }

    public static Specification<Book> hasCategory(String categoryName) {
        return (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(
                        root.join("categories").get("name"),
                        categoryName
                );
    }
}