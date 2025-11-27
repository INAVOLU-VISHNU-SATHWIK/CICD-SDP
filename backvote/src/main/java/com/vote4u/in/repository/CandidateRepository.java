package com.vote4u.in.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vote4u.in.model.Candidate;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
