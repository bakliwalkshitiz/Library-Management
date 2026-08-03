package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.CategoryRequest;
import com.kshitiz.librarymanagementsystem.dto.CategoryResponse;
import com.kshitiz.librarymanagementsystem.entity.Category;
import com.kshitiz.librarymanagementsystem.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CategoryService {

    private static final Logger logger =
            LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public String addCategory(CategoryRequest request) {

        Category category = new Category();

        category.setName(request.getName());

        categoryRepository.save(category);

        return "Category Added Successfully";
    }

    public List<CategoryResponse> getAllCategories() {

        List<Category> categories = categoryRepository.findAll();

        List<CategoryResponse> response = new ArrayList<>();

        for (Category category : categories) {

            response.add(
                    new CategoryResponse(
                            category.getId(),
                            category.getName()
                    )
            );
        }

        return response;
    }

    public CategoryResponse getCategoryById(int id) {

        Optional<Category> optionalCategory =
                categoryRepository.findById(id);

        if (optionalCategory.isPresent()) {

            Category category = optionalCategory.get();

            return new CategoryResponse(
                    category.getId(),
                    category.getName()
            );
        }

        return null;
    }

    public String updateCategory(int id, CategoryRequest request) {

        Optional<Category> optionalCategory =
                categoryRepository.findById(id);

        if (optionalCategory.isPresent()) {

            Category category = optionalCategory.get();

            category.setName(request.getName());

            categoryRepository.save(category);

            return "Category Updated Successfully";
        }

        return "Category Not Found";
    }

    public String deleteCategory(int id) {

        if (categoryRepository.existsById(id)) {

            categoryRepository.deleteById(id);

            return "Category Deleted Successfully";
        }

        return "Category Not Found";
    }
}