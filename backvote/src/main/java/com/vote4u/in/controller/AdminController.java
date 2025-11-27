package com.vote4u.in.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.vote4u.in.model.Election;
import com.vote4u.in.model.User;
import com.vote4u.in.service.ElectionService;
import com.vote4u.in.service.UserService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private ElectionService electionService;

    @Autowired
    private UserService userService;

    @PostMapping("/elections")
    public ResponseEntity<Election> createElection(@RequestBody Election election) {
        return ResponseEntity.ok(electionService.createElection(election));
    }

    @GetMapping("/elections")
    public List<Election> getAllElections() {
        return electionService.getAll();
    }

    @DeleteMapping("/elections/{id}")
    public ResponseEntity<Void> deleteElection(@PathVariable Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/elections/{electionId}/register/{userId}")
    public ResponseEntity<Election> registerContestant(
            @PathVariable Long electionId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(electionService.registerContestant(electionId, userId));
    }
 // DELETE /admin/elections/{electionId}/unregister/{userId}
    @DeleteMapping("/elections/{electionId}/unregister/{userId}")
    public ResponseEntity<Election> unregisterContestant(
            @PathVariable Long electionId,
            @PathVariable Long userId) {
        try {
            Election e = electionService.unregisterContestant(electionId, userId);
            return ResponseEntity.ok(e);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }


    @PostMapping("/elections/{electionId}/vote/{contestantId}/{voterId}")
    public ResponseEntity<String> vote(
            @PathVariable Long electionId,
            @PathVariable Long contestantId,
            @PathVariable Long voterId) {
        try {
            electionService.vote(electionId, contestantId, voterId);
            return ResponseEntity.ok("Vote successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/voters")
    public List<User> getAllVoters() {
        return userService.getUsersByRole("VOTER");
    }

    @GetMapping("/contestants")
    public List<User> getAllContestants() {
        return userService.getUsersByRole("CONTESTANT");
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
 // Update election (Admin only)
 // Update election (Admin only)
    @PutMapping("/elections/{id}")
    public ResponseEntity<Election> updateElection(
            @PathVariable Long id,
            @RequestBody Election updatedElection) {

        // Call service to handle update
        Election updated = electionService.updateElection(id, updatedElection);
        return ResponseEntity.ok(updated);
    }
    @PostMapping("/elections/{id}/declareWinner")
    public ResponseEntity<String> declareWinner(
            @PathVariable Long id,
            @RequestBody Map<String, String> winnerData) {

        String winnerName = winnerData.get("winnerName");
        String winnerDetails = winnerData.get("winnerDetails");

        try {
            electionService.declareWinner(id, winnerName, winnerDetails);
            return ResponseEntity.ok("Winner declared successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
