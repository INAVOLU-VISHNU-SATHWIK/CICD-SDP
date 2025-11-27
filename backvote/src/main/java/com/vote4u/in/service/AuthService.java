package com.vote4u.in.service;

import org.springframework.stereotype.Service;

import com.vote4u.in.dto.LoginRequest;
import com.vote4u.in.dto.SignupRequest;
import com.vote4u.in.model.User;
import com.vote4u.in.repository.UserRepository;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.SimpleMailMessage;


@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public AuthService(UserRepository userRepository, JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
    }

    // Signup method stays the same
    public User signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email already registered!");
        }
        if (userRepository.findByAadharNumber(request.getAadharNumber()) != null) {
            throw new RuntimeException("Aadhar number already registered!");
        }
        if (userRepository.findByMobileNumber(request.getMobileNumber()) != null) {
            throw new RuntimeException("Mobile number already registered!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setDob(request.getDob());
        user.setAddress(request.getAddress());
        user.setAadharNumber(request.getAadharNumber());
        user.setMobileNumber(request.getMobileNumber());
        user.setHasVoted(false);
        user.setRole(request.getRole().toUpperCase());

        return userRepository.save(user);
    }

    // 🔹 Fixed login method
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null || !user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }
        return user; // return full User object
    }
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("No account found with this email");
        }

        // generate temporary reset link (in real apps -> with JWT token)
        String resetLink = "http://localhost:5173/reset-password?email=" + email;

        // send mail
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Hi " + user.getName() + ",\n\n" + "Click the link below to reset your password:\n" + resetLink);

        mailSender.send(message);
    }
    public User resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        user.setPassword(newPassword); // ⚠️ hash this in production
        return userRepository.save(user);
    }

}
