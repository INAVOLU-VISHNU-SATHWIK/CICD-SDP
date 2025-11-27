package com.vote4u.in.model;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users",
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "email"),
           @UniqueConstraint(columnNames = "aadharNumber"),
           @UniqueConstraint(columnNames = "mobileNumber")
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    private String name;
    private String email;
    private String password;

    private String dob;
    private String address;

    private String aadharNumber;   // unique government ID
    private String mobileNumber;   // unique mobile

    private Boolean hasVoted = false;

    // Role comes from radio button: "VOTER" or "CONTESTANT"
    private String role;
 // Only relevant for contestants
    private Integer voteCount = 0;

}

