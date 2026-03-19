package com.logiq.backend.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String role;
    private String fullName;
    private String message;

    public AuthResponse(String token, String email, String role, String fullName, String message) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.fullName = fullName;
        this.message = message;
    }

    // Getters
    public String getToken() {
        return token;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getFullName() {
        return fullName;
    }

    public String getMessage() {
        return message;
    }
}
