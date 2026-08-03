package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.dto.RegisterRequest;
import com.kshitiz.librarymanagementsystem.dto.RegisterResponse;
import com.kshitiz.librarymanagementsystem.service.AuthService;
import org.springframework.web.bind.annotation.*;
import com.kshitiz.librarymanagementsystem.dto.LoginRequest;
import com.kshitiz.librarymanagementsystem.dto.LoginResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public RegisterResponse register(
            @RequestBody RegisterRequest request) {

        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(
            @RequestBody LoginRequest request) {

        return authService.login(request);
    }

}