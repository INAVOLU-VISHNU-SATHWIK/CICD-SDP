package com.vote4u.in.service;

import org.springframework.stereotype.Service;
import com.vote4u.in.model.User;
import com.vote4u.in.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository repo;
    private final JWTManager jwtManager;

    public UserService(UserRepository repo, JWTManager jwtManager) {
        this.repo = repo;
        this.jwtManager = jwtManager;
    }

    // ✅ Get all users
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // ✅ Get user by ID
    public User getUserById(Long id) {
        return repo.findById(id).orElse(null);
    }

    // ✅ Save or update user
    public User saveUser(User user) {
        return repo.save(user);
    }

    // ✅ Delete user
    public void deleteUser(Long id) {
        repo.deleteById(id);
    }

    // ✅ Get all voters
    public List<User> getUsersByRole(String role) {
        return repo.findAll()
                   .stream()
                   .filter(u -> u.getRole() != null && u.getRole().equalsIgnoreCase(role))
                   .collect(Collectors.toList());
    }

    // ✅ Shortcut methods
    public List<User> getAllVoters() {
        return getUsersByRole("VOTER");
    }

    public List<User> getAllContestants() {
        return getUsersByRole("CONTESTANT");
    }
    public String validateCredentials(String email, String password) {
        if (repo.validateCredentials(email, password) > 0) {
            String token = jwtManager.generateToken(email);
            return "200::" + token;
        }
        return "401::Invalid Credentials";
    }

}
