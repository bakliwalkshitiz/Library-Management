package com.kshitiz.librarymanagementsystem.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthorRequest {

    @NotBlank(message = "Author name is required")
    private String name;

    @Email(message = "Invalid email")
    private String email;

    public AuthorRequest() {
    }

    public AuthorRequest(String name, String email) {
        this.name = name;
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}