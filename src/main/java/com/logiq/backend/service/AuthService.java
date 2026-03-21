package com.logiq.backend.service;

import com.logiq.backend.dto.AuthResponse;
import com.logiq.backend.dto.LoginRequest;
import com.logiq.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
