package com.vote4u.in.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vote4u.in.model.Vote;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    long countByCandidate_CandidateId(Long candidateId);
    List<Vote> findByUser_UserId(Long userId); 
}
