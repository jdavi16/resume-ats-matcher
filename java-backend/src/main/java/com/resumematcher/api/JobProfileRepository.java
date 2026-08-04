package com.resumematcher.api;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JobProfileRepository extends JpaRepository<JobProfile,Long> {
    Optional<JobProfile> findByJobTitleIgnoreCase(String jobTitle);
}
