package com.kshitiz.librarymanagementsystem.service;

import com.kshitiz.librarymanagementsystem.dto.LoginRequest;
import com.kshitiz.librarymanagementsystem.dto.LoginResponse;
import com.kshitiz.librarymanagementsystem.dto.RegisterRequest;
import com.kshitiz.librarymanagementsystem.dto.RegisterResponse;
import com.kshitiz.librarymanagementsystem.entity.User;
import com.kshitiz.librarymanagementsystem.entity.enums.Role;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import com.kshitiz.librarymanagementsystem.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private static final Logger logger =
            LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public RegisterResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role requestedRole = Role.USER;
        if (request.getRole() != null && request.getRole().equalsIgnoreCase("PUBLISHER")) {
            requestedRole = Role.PUBLISHER;
        }
        // NOTE: ADMIN is never assignable through public registration — there is exactly
        // one admin account, configured manually (app.super-admin-email).
        user.setRole(requestedRole);

        User savedUser = userRepository.save(user);
        logger.info("Registered user '{}' with role {}", savedUser.getEmail(), requestedRole);

        RegisterResponse response = new RegisterResponse();
        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        return response;
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user.getEmail(), user.getRole());

        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
