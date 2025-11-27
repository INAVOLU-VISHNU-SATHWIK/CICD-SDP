package com.vote4u.in.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.vote4u.in.model.Election;

public interface ElectionRepository extends JpaRepository<Election, Long> {
}
