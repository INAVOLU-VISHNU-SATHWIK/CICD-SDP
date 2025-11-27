package com.vote4u.in.controller;

import org.springframework.web.bind.annotation.*;

import com.vote4u.in.model.Vote;
import com.vote4u.in.service.VoteService;

import java.util.List;

@RestController
@RequestMapping("/api/votes")
@CrossOrigin
public class VoteController {
    private final VoteService service;

    public VoteController(VoteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Vote> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Vote create(@RequestBody Vote vote) {
        return service.save(vote);
    }

    @GetMapping("/count/{candidateId}")
    public long countVotes(@PathVariable Long candidateId) {
        return service.countVotesByCandidate(candidateId);
    }
}

