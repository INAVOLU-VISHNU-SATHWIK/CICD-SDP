package com.vote4u.in.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vote4u.in.model.Election;
import com.vote4u.in.model.User;
import com.vote4u.in.repository.ElectionRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ElectionService {
    private final ElectionRepository repo;

    @Autowired
    private UserService userService;

    public ElectionService(ElectionRepository repo) {
        this.repo = repo;
    }

    // Get all elections
    public List<Election> getAll() {
        List<Election> elections = repo.findAll();
        elections.forEach(this::updateStatus);
        return elections;
    }

    // Create new election
    public Election createElection(Election election) {
        election.setStatus("UPCOMING");
        return repo.save(election);
    }

    // Update existing election
 // Update existing election
    public Election updateElection(Long id, Election updatedElection) {
        Election existingElection = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        existingElection.setName(updatedElection.getName());
        existingElection.setState(updatedElection.getState());
        existingElection.setRegion(updatedElection.getRegion());
        existingElection.setStartDate(updatedElection.getStartDate());
        existingElection.setEndDate(updatedElection.getEndDate());
        existingElection.setStartTime(updatedElection.getStartTime());
        existingElection.setEndTime(updatedElection.getEndTime());
        existingElection.setDescription(updatedElection.getDescription());

        return repo.save(existingElection);
    }


    // Delete election
    public void deleteElection(Long id) {
        repo.deleteById(id);
    }

    // Get election by ID
    public Optional<Election> getById(Long id) {
        return repo.findById(id).map(e -> {
            updateStatus(e);
            return e;
        });
    }

    // Register contestant
    public Election registerContestant(Long electionId, Long userId) {
        Election election = repo.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));
        User contestant = userService.getUserById(userId);
        if (contestant == null) throw new RuntimeException("User not found");
        if (!"CONTESTANT".equalsIgnoreCase(contestant.getRole()))
            throw new RuntimeException("Only CONTESTANT can register");

        if (!election.getContestants().contains(contestant))
            election.getContestants().add(contestant);

        return repo.save(election);
    }
    public Election unregisterContestant(Long electionId, Long userId) {
        Election election = repo.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        User contestant = userService.getUserById(userId);
        if (contestant == null) throw new RuntimeException("User not found");
        if (!"CONTESTANT".equalsIgnoreCase(contestant.getRole()))
            throw new RuntimeException("Only CONTESTANT can unregister");

        election.getContestants().remove(contestant); // remove contestant from list
        return repo.save(election);
    }


    // Vote for a contestant
 // Vote for a contestant
    public void vote(Long electionId, Long contestantId, Long voterId) {
        Election election = repo.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        // 🔥 Refresh status before validation
        updateStatus(election);

        if (!"ONGOING".equalsIgnoreCase(election.getStatus()))
            throw new RuntimeException("Election is not ongoing");

        User voter = userService.getUserById(voterId);

        // ✅ Check per-election voting
        if (election.getVotedVoters().contains(voterId)) {
            throw new RuntimeException("You have already voted in this election");
        }

        User contestant = userService.getUserById(contestantId);
        if (contestant == null) throw new RuntimeException("Contestant not found");

        // ✅ Increment vote count
        Map<Long, Integer> votes = election.getVotes();
        votes.put(contestantId, votes.getOrDefault(contestantId, 0) + 1);
        election.setVotes(votes);

        // ✅ Record this voter as having voted in this election
        election.getVotedVoters().add(voterId);

        // Save both voter + election
        userService.saveUser(voter); // still saves any future updates to User
        repo.save(election);
    }

    // Auto-update election status
    private void updateStatus(Election election) {
        try {
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();

            LocalDate start = LocalDate.parse(election.getStartDate());
            LocalDate end = LocalDate.parse(election.getEndDate());
            LocalTime startT = LocalTime.parse(election.getStartTime());
            LocalTime endT = LocalTime.parse(election.getEndTime());

            if (today.isBefore(start) || (today.isEqual(start) && now.isBefore(startT))) {
                election.setStatus("UPCOMING");
            } else if ((today.isAfter(start) || today.isEqual(start)) &&
                       (today.isBefore(end) || (today.isEqual(end) && now.isBefore(endT)))) {
                election.setStatus("ONGOING");
            } else {
                election.setStatus("CLOSED");
            }
        } catch (Exception e) {
            election.setStatus("UNKNOWN");
        }
    }
    public void declareWinner(Long electionId, String winnerName, String winnerDetails) {
        Election election = repo.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (!"CLOSED".equalsIgnoreCase(election.getStatus())) {
            throw new RuntimeException("Election is not closed yet");
        }

        election.setWinnerName(winnerName);
        election.setWinnerDetails(winnerDetails);
        repo.save(election);
    }

}
