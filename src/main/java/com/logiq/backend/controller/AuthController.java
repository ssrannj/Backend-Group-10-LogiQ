package com.logiq.backend.controller;

import com.logiq.backend.model.User;
import com.logiq.backend.repository.UserRepository;
import com.logiq.backend.util.JwtUtil;
import com.logiq.backend.dto.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody User newUser) {
        if (userRepository.findByEmail(newUser.getEmail()) != null) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, null, null, null, "Email is already registered!"));
        }

        if (newUser.getRole() == null) {
            newUser.setRole("CUSTOMER");
        }

        String hashedPassword = passwordEncoder.encode(newUser.getPassword());
        newUser.setPassword(hashedPassword);

        userRepository.save(newUser);
        return ResponseEntity.ok(new AuthResponse(null, newUser.getEmail(), newUser.getRole(), newUser.getFullName(),
                "Account created successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody User loginRequest) {
        User dbUser = userRepository.findByEmail(loginRequest.getEmail());

        if (dbUser != null && passwordEncoder.matches(loginRequest.getPassword(), dbUser.getPassword())) {
            String token = JwtUtil.generateToken(dbUser.getEmail(), dbUser.getRole());
            return ResponseEntity.ok(new AuthResponse(token, dbUser.getEmail(), dbUser.getRole(), dbUser.getFullName(),
                    "Login successful!"));
        } else {
            return ResponseEntity.status(401).body(new AuthResponse(null, null, null, null, "Invalid Credentials"));
        }
    }
}