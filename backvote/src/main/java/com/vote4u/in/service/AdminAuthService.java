package com.vote4u.in.service;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {
    private static final String ADMIN_USER = "sathwik";
    private static final String ADMIN_PASS = "sathwik";

    public boolean isAdmin(String username, String password) {
        return ADMIN_USER.equals(username) && ADMIN_PASS.equals(password);
    }
}

