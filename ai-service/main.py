from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from google import genai
from google.genai import errors, types

load_dotenv()

app = FastAPI()

# Genai initalization
client = genai.Client()

generation_config = {"temperature": 0.7, "max_output_tokens": 100, "top_p": 0.95}


@app.get("/match")
def main(job_title: str | None = None):

    
    if not job_title or job_title.strip() == "":
        raise HTTPException(
            status_code=400, detail="Please provide a valid job title"
        )
    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=f"Analyze the technical fit for a candidate targeting this position: {job_title}",
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
                response_mime_type ="application/json", # Forces Gemini to speak native JSON strings
                max_output_tokens=5000,
                temperature=0.2, # Lower temp makes structure highly predicatable and strict
            ),
        )

        import json
        ai_data = json.loads(response.text.strip())


        return ai_data
    except errors.APIError as e:
        # Catch configuration errors, bad keys or network failures
        print(f"Error Code:{e.code}")
        print(f"Error Message: {e.message}")

        raise HTTPException(
            status_code=502,  # Bad Gateway error
            detail=f"Gemini API Engine Error: {e.message}",
        )

