package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.CategoryRequest;
import com.kshitiz.librarymanagementsystem.dto.CategoryResponse;
import com.kshitiz.librarymanagementsystem.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PostMapping
    public ResponseEntity<String> addCategory(
            @Valid @RequestBody CategoryRequest request) {

        return new ResponseEntity<>(
                categoryService.addCategory(request),
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {

        return new ResponseEntity<>(
                categoryService.getAllCategories(),
                HttpStatus.OK
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable int id) {

        return new ResponseEntity<>(
                categoryService.getCategoryById(id),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(
            @PathVariable int id,
            @Valid @RequestBody CategoryRequest request) {

        return new ResponseEntity<>(
                categoryService.updateCategory(id, request),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCategory(
            @PathVariable int id) {

        return new ResponseEntity<>(
                categoryService.deleteCategory(id),
                HttpStatus.OK
        );
    }
}