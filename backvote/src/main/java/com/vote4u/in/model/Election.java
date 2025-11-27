package com.vote4u.in.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Table(name = "elections")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long electionId;

    private String name;
    private String state;
    private String region;

    private String startDate;  
    private String endDate;    
    private String startTime;  
    private String endTime;    

    private String status;     // UPCOMING, ONGOING, CLOSED
    private String description;

    // Contestants registered for this election
    @ManyToMany
    @JoinTable(
        name = "election_contestants",
        joinColumns = @JoinColumn(name = "election_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> contestants = new ArrayList<>();

    // Votes per contestant
    @ElementCollection
    private Map<Long, Integer> votes = new HashMap<>();
    private String winnerName;
    private String winnerDetails;

    // Getters and setters
    public Long getElectionId() { return electionId; }
    public void setElectionId(Long electionId) { this.electionId = electionId; }

    // ... other existing getters and setters ...

    public String getWinnerName() { return winnerName; }
    public void setWinnerName(String winnerName) { this.winnerName = winnerName; }

    public String getWinnerDetails() { return winnerDetails; }
    public void setWinnerDetails(String winnerDetails) { this.winnerDetails = winnerDetails; }
    @ElementCollection
    private Set<Long> votedVoters = new HashSet<>();

}
