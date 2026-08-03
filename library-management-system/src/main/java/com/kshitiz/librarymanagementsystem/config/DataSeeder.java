package com.kshitiz.librarymanagementsystem.config;

import com.kshitiz.librarymanagementsystem.entity.User;
import com.kshitiz.librarymanagementsystem.entity.enums.Role;
import com.kshitiz.librarymanagementsystem.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    // There is exactly ONE admin account in this system. It is fixed here and
    // can only be changed later from inside the admin panel itself (Settings ->
    // Change Admin Credentials), never through public registration.
    private static final String ADMIN_EMAIL = "leader@gmail.com";
    private static final String ADMIN_PASSWORD = "Kshitiz977@";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1) Make sure the one true admin account exists with the fixed credentials.
        userRepository.findByEmail(ADMIN_EMAIL).ifPresentOrElse(user -> {
            user.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            user.setRole(Role.ADMIN);
            userRepository.save(user);
            logger.info("Updated fixed admin account credentials for {}", ADMIN_EMAIL);
        }, () -> {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(ADMIN_EMAIL);
            admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            logger.info("Created the fixed admin account: {}", ADMIN_EMAIL);
        });

        // 2) Anyone else who somehow has ADMIN (e.g. leftover from earlier testing)
        //    gets demoted to PUBLISHER — there is only ever one real admin.
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.ADMIN && !u.getEmail().equalsIgnoreCase(ADMIN_EMAIL))
                .forEach(u -> {
                    u.setRole(Role.PUBLISHER);
                    userRepository.save(u);
                    logger.info("Demoted extra admin account {} to PUBLISHER", u.getEmail());
                });
    }
}
