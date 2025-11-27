package com.vote4u.in.dto;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
