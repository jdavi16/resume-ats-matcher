package com.resumematcher.api;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = "*") // Connect to React
@RestController
@RequestMapping("/api/match")
public class JobProfileController {

	private static final Logger log = LoggerFactory.getLogger(JobProfileController.class);

	private final RestTemplate restTemplate = new RestTemplate();
	private final JobProfileRepository jobProfileRepository;

	public JobProfileController(JobProfileRepository jobProfileRepository) {
		this.jobProfileRepository = jobProfileRepository;
	}

	@PostMapping("/search")
	public JobProfile searchJobProfile(@RequestBody JobProfile incomingPayload) {

		// Extract out of the JSON body from PDF safely
		String jobTitle = incomingPayload.getJobTitle();
		String resumeText = incomingPayload.getResumeText();

		if (jobTitle == null || jobTitle.trim().isEmpty()) {
			throw new IllegalArgumentException("Job title cannot be null or empty.");
		}

		// Check if job profile already exists
		Optional<JobProfile> cachedJobProfile = jobProfileRepository.findByJobTitleIgnoreCase(jobTitle);

		if (cachedJobProfile.isPresent()) {
			log.info("Job Profile found: Loading {} from database", jobTitle);
			return cachedJobProfile.get(); // Bypasses python and gives and immediate response
		}

		log.info("No job profile found: Fetching {} from API.", jobTitle);

		// Target URL for Python microservice
		String targetUrl = "http://localhost:8000/match";
		Map<String, String> pythonRequestBody = new HashMap<>();

		pythonRequestBody.put("job_title", jobTitle);

		// Pass text layer extracted from PDF
		pythonRequestBody.put("resume_text", resumeText != null ? resumeText : "");

		// Network call to python, return JSON response
		@SuppressWarnings("unchecked")
		Map<String, String> pythonResponse = restTemplate.postForObject(targetUrl, pythonRequestBody, Map.class);

		// Extract Job profile from parsed dict keys
		String aiAdvice = (pythonResponse != null && pythonResponse.get("optimization_advice") != null)
				? pythonResponse.get("optimization_advice")
				: "No report found.";
		String missingKeywords = (pythonResponse != null ? pythonResponse.get("missing_keywords")
				: "No missing keywords found.");
		Long compatibilityScore = safeParseLong(
				pythonResponse != null ? pythonResponse.get("compatibility_score") : null, 0L);
		Long experienceRequired = safeParseLong(
				pythonResponse != null ? pythonResponse.get("experience_required") : null, 0L);
		Long atsPassProbability = safeParseLong(
				pythonResponse != null ? pythonResponse.get("ats_pass_probability") : null, 0L);

		// Create new database model objects, populate and commit
		JobProfile newJobProfile = new JobProfile();
		newJobProfile.setJobTitle(jobTitle);
		newJobProfile.setMissingKeywords(missingKeywords);
		newJobProfile.setCompatibilityScore(compatibilityScore);
		newJobProfile.setExperienceRequired(experienceRequired);
		newJobProfile.setAtsPassProbability(atsPassProbability);
		newJobProfile.setOptimizationAdvice(aiAdvice);
		newJobProfile.setResumeText(resumeText);

		jobProfileRepository.save(newJobProfile);
		return newJobProfile;
	}

	@GetMapping("/cached")
	public List<JobProfile> getAllCachedJobProfiles() {
		return jobProfileRepository.findAll();
	}

	private Long safeParseLong(Object value, Long defaultValue) {
		if (value == null) {
			return defaultValue;
		}
		if (value instanceof Number num) {
			return num.longValue();
		}
		try {
			return Long.valueOf(value.toString().trim());
		} catch (NumberFormatException e) {
			log.warn("Failed to parse Long from value: {} Using default: {}", value, defaultValue);
			return defaultValue;
		}
	}

}
