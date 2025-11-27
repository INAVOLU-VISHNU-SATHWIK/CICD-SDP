package com.vote4u.in.controller;

import org.springframework.web.bind.annotation.*;
import com.vote4u.in.model.Election;
import com.vote4u.in.service.ElectionService;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@CrossOrigin("*")
public class ElectionController {

    private final ElectionService electionService;

    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }

    // ✅ Get all elections (for voters or contestants)
    @GetMapping
    public List<Election> getAllElections() {
        return electionService.getAll();
    }

    // ✅ Get election by ID (optional)
    @GetMapping("/{id}")
    public Election getElectionById(@PathVariable Long id) {
        return electionService.getById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));
    }
}
