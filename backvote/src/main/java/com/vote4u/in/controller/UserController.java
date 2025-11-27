package com.vote4u.in.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vote4u.in.model.User;
import com.vote4u.in.model.Vote;
//import com.vote4u.in.model.Election;
import com.vote4u.in.service.UserService;
import com.vote4u.in.service.VoteService;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {
    private final UserService service;
    private final VoteService voteService;
    
    public UserController(UserService service, VoteService voteService) {
        this.service = service;
        this.voteService = voteService;
    }

    @GetMapping
    public List<User> getAll() {
        return service.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return service.getUserById(id);
    }

    @PostMapping
    public User create(@RequestBody User user) {
        return service.saveUser(user);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteUser(id);
    }

    // ✅ NEW ENDPOINT: Get voter profile with voting history
    @GetMapping("/voter/{id}/profile")
    public ResponseEntity<?> getVoterProfile(@PathVariable Long id) {
        try {
            User voter = service.getUserById(id);
            if (voter == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Voter not found");
            }

            // Fetch votes cast by this voter
            List<Vote> votes = voteService.getVotesByVoter(id);

            // Build response
            List<Map<String, Object>> votedElections = new ArrayList<>();
            for (Vote v : votes) {
                Map<String, Object> map = new HashMap<>();
                map.put("electionId", v.getElection().getElectionId());
                map.put("electionName", v.getElection().getName());
                map.put("candidateId", v.getCandidate().getCandidateId());
                map.put("candidateName", v.getCandidate().getName());
                votedElections.add(map);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("user", voter);
            response.put("votedElections", votedElections);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching voter profile: " + e.getMessage());
        }
    }
    @PostMapping("/signin")
    public String signin(@RequestBody User u) {
        return service.validateCredentials(u.getEmail(), u.getPassword());
    }


}
