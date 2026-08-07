from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from google import genai
from google.genai import errors, types
import json

load_dotenv()
app = FastAPI()
# GenAI Initialization
client = genai.Client()

generation_config = {"temperature": 0.7, "max_output_tokens": 100, "top_p": 0.95}


# Pydantic Scheme layout
class MatchRequest(BaseModel):
	job_title: str
	resume_text: str


@app.post("/match")
async def main(request: MatchRequest):
	if not request.job_title or request.job_title.strip() == "":
		raise HTTPException(
			status_code=400, detail="Please provide a valid job title"
		)
	try:

		prompt = (
			f"Cross-examine the candidate's actual resume content against standard industry expectations "
			f"for this target job position title: '{request.job_title}'."
			f"=== CANDIDATE RESUME TEXT EXTRACTED ===\n"
			f"{request.resume_text}\n"
			f"========================================\n\n"
			f"Evaluate alignment mismatches, missing technical frameworks, target experience metrics, "
			f"and return strict actionable recommendations and optimization advice."
		)
		response = client.models.generate_content(
			model="gemini-3.6-flash",
			contents=prompt,
			config=types.GenerateContentConfig(
				system_instruction=(
					"You are an expert corporate technical recruiter and ATS Specialist. "
					"You must reply strictly with a single JSON object. Do not include markdown code blocks."
					"Evaluate the industry compatibility landscape for the requested job profile."
					"The JSON Object must use these exact keys: "
					'{"job_title": "The requested job title.",'
					'"compatibility_score": "Overall alignment score from 0 to 100 as an integer.", '
					'"missing_keywords": "Comma-separated string of critical skills or frameworks missing from resumes for this role.",'
					'"experience_required":"Average target years of experience expected as an integer.", '
					'"ats_pass_probability": "Estimated ATS baseline pass probability percentage from 0 to 100 as an integer.", '
					'"optimization_advice": "Direct 1-2 sentence tactical advice advising the candidate how to tailor their resume."}'
				),
				response_mime_type="application/json",  # Forces Gemini to speak native JSON strings
				max_output_tokens=5000,
				temperature=0.2,  # Lower temp makes structure highly predicatable and strict
			),
		)

		ai_data = json.loads(response.text.strip())

		return ai_data
	except errors.APIError as e:
		# Catch configuration errors, bad keys or network failures
		print(f"Error Code:{e.code}")
		print(f"Error Message: {e.message}")
		print(f"Gemini API Engine Error Status: {e.message}")

		return {
			"job_title": request.job_title,
			"compatibility_score": 0,
			"missing_keywords": "Error parsing, AI endpoint down",
			"experience_required": 0,
			"ats_pass_probability": 0,
			"optimization_advice": f"Internal microservice execution exception: {str(e)}",
		}
