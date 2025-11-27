package com.vote4u.in.service;

import org.springframework.stereotype.Service;
import com.vote4u.in.model.Vote;
import com.vote4u.in.repository.VoteRepository;

import java.util.List;

@Service
public class VoteService {
    private final VoteRepository repo;

    public VoteService(VoteRepository repo) {
        this.repo = repo;
    }

    public List<Vote> getAll() {
        return repo.findAll();
    }

    public Vote save(Vote vote) {
        return repo.save(vote);
    }

    public long countVotesByCandidate(Long candidateId) {
        return repo.countByCandidate_CandidateId(candidateId);
    }

    // ✅ NEW METHOD
    public List<Vote> getVotesByVoter(Long userId) {
        return repo.findByUser_UserId(userId);
    }
}
