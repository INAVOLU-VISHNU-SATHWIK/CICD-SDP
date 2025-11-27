package com.vote4u.in.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "candidates")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long candidateId;

    private String name;
    private String party;
    private String profileDetails;

    @ManyToOne
    @JoinColumn(name = "election_id")
    private Election election;
}
