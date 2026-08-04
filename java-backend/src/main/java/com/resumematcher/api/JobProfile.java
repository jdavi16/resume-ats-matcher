package com.resumematcher.api;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_profiles")
public class JobProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(name = "compatibility_score")
    private Long compatibilityScore;

    @Column(name = "missing_keywords")
    private String missingKeywords;

    @Column(name = "experience_required")
    private Long experienceRequired;

    @Column(name = "ats_pass_probability")
    private Long atsPassProbability;

    @Column(name = "optimization_advice", length = 1000)
    private String optimizationAdvice;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public Long getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Long compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public String getMissingKeywords() {
        return missingKeywords;
    }

    public void setMissingKeywords(String missingKeywords) {
        this.missingKeywords = missingKeywords;
    }

    public Long getExperienceRequired(){ return experienceRequired;}

    public void setExperienceRequired(Long experienceRequired){this.experienceRequired = experienceRequired;}

    public Long getAtsPassProbability(){return atsPassProbability;}

    public void setAtsPassProbability(Long atsPassProbability){this.atsPassProbability = atsPassProbability;}

    public String getOptimizationAdvice(){return optimizationAdvice;}

    public void setOptimizationAdvice(String optimizationAdvice){this.optimizationAdvice=optimizationAdvice;}
}
