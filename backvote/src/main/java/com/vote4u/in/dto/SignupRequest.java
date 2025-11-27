package com.vote4u.in.dto;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private String dob;
    private String address;
    private String aadharNumber;
    private String mobileNumber;
    private String role; // VOTER or CONTESTANT (from frontend radio button)
}
