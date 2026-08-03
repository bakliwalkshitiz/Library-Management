package com.kshitiz.librarymanagementsystem.controller;

import com.kshitiz.librarymanagementsystem.entity.enums.Role;
import com.kshitiz.librarymanagementsystem.entity.User;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin-email:}")
    private String superAdminEmail;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private boolean isSuperAdmin(Authentication auth) {
        return superAdminEmail != null && !superAdminEmail.isBlank()
                && auth != null && superAdminEmail.equalsIgnoreCase(auth.getName());
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @PutMapping("/me/payment")
    public User updateMyPaymentInfo(@RequestBody java.util.Map<String, String> body, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setUpiId(body.get("upiId"));
        user.setQrImageUrl(body.get("qrImageUrl"));
        return userRepository.save(user);
    }

    // The ONE admin account changes its own login here — nowhere else can email/role become ADMIN.
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/me/admin-credentials")
    public String updateAdminCredentials(@RequestBody java.util.Map<String, String> body, Authentication auth) {
        if (!isSuperAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the admin can change their own credentials.");
        }
        User admin = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Admin account not found"));

        String newEmail = body.get("email");
        String newPassword = body.get("password");
        String currentPassword = body.get("currentPassword");

        if (currentPassword == null || !passwordEncoder.matches(currentPassword, admin.getPassword())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Current password is incorrect.");
        }
        if (newEmail != null && !newEmail.isBlank()) {
            userRepository.findByEmail(newEmail).ifPresent(existing -> {
                if (!existing.getId().equals(admin.getId())) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "That email is already in use.");
                }
            });
            admin.setEmail(newEmail);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            admin.setPassword(passwordEncoder.encode(newPassword));
        }
        userRepository.save(admin);
        return "Admin credentials updated. Please log in again with your new details.";
    }

    @PreAuthorize("hasAnyRole('ADMIN','PUBLISHER')")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User userDetails, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ADMIN is never assignable here — there is exactly one fixed admin account.
        if (userDetails.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "The admin role can't be granted this way — there is only one fixed admin account.");
        }
        // Only the super-admin may touch an existing admin's own row via this endpoint
        if (user.getRole() == Role.ADMIN && !isSuperAdmin(auth)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Only the admin can manage their own account.");
        }

        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        if (userDetails.getRole() != null) {
            user.setRole(userDetails.getRole());
        }
        return userRepository.save(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id, Authentication auth) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "The admin account can't be deleted.");
        }

        userRepository.deleteById(id);
        return "User deleted successfully";
    }
}
