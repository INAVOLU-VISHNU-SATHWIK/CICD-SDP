package com.vote4u.in.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.vote4u.in.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByAadharNumber(String aadharNumber);
    User findByMobileNumber(String mobileNumber);
    @Query("select count(u) from User u where u.email=:email and u.password=:password")
    public int validateCredentials(String email, String password);

}


