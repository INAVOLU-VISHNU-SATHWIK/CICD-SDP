package com.vote4u.in.service;

import org.springframework.stereotype.Service;

import com.vote4u.in.model.Candidate;
import com.vote4u.in.repository.CandidateRepository;

import java.util.List;

@Service
public class CandidateService {
    private final CandidateRepository repo;

    public CandidateService(CandidateRepository repo) {
        this.repo = repo;
    }

    public List<Candidate> getAll() {
        return repo.findAll();
    }

    public Candidate getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Candidate save(Candidate candidate) {
        return repo.save(candidate);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}

