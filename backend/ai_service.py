import os
import google.generativeai as genai
import json

# Fetch API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# We use gemini-2.5-flash as the standard available model
model = genai.GenerativeModel('gemini-2.5-flash')

def generate_career_roadmap(career: str, education_level: str, time_commitment: str) -> dict:
    """
    Calls Gemini API to generate a personalized career roadmap in JSON format.
    """
    if not api_key:
        # Fallback dummy data if no key is present during dev
        return {
            "career": career,
            "description": f"A roadmap to become a {career}",
            "milestones": [
                {"title": "Fundamentals", "duration": "2 weeks", "tasks": ["Learn Basics", "Understand Concepts"]}
            ]
        }

    prompt = f"""
    You are an expert AI Career Coach and Technical Mentor. Generate a highly detailed and practical learning roadmap for becoming a {career}.
    The user's current education level is {education_level} and they can commit to studying {time_commitment}.
    Create exactly 4 to 6 comprehensive milestones. Each milestone must have 3-5 specific, actionable tasks, and 1 capstone project.
    Return the response EXCLUSIVELY as a valid JSON object with the following structure:
    {{
        "career": "{career}",
        "description": "Brief, motivating description of this career path.",
        "estimated_months": 6,
        "milestones": [
            {{
                "title": "Milestone name (e.g., Advanced System Design)",
                "duration": "e.g., 4 weeks",
                "description": "What they will learn in this milestone",
                "tasks": ["Specific actionable task 1", "Specific actionable task 2", "Specific actionable task 3"],
                "projects": ["A concrete capstone project suggestion to solidify these skills"]
            }}
        ]
    }}
    Ensure the JSON is perfectly formatted and does not contain markdown backticks (like ```json).
    """

    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        import re
        # Find the first { and last } to robustly extract just the JSON object
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
            text = text[start_idx:end_idx+1]
        
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        return {"error": f"Failed to generate roadmap: {str(e)}"}

def get_career_insights(career: str) -> dict:
    """
    Calls Gemini API to get insights about a specific career path.
    """
    if not api_key:
        return {
            "career": career,
            "salary_range": "$70k - $150k",
            "demand": "High",
            "key_skills": ["Skill 1", "Skill 2"]
        }
        
    prompt = f"""
    Provide career insights for a {career}.
    Return EXCLUSIVELY as a valid JSON object:
    {{
        "career": "{career}",
        "overview": "Brief overview",
        "salary_range": "e.g. $80k - $160k",
        "demand": "e.g. Very High",
        "key_skills": ["Skill 1", "Skill 2", "Skill 3"],
        "top_companies": ["Company 1", "Company 2"]
    }}
    Ensure no markdown backticks.
    """
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {"error": f"Failed to get insights: {str(e)}"}

def chat_with_mentor(message: str, history: list) -> str:
    """
    Simple single-turn chat with history injected into prompt.
    """
    if not api_key:
        return f"AI Mentor (Mock): You said '{message}'"
        
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
    
    prompt = f"""
    You are an expert AI Career Mentor for SkillForge.
    You help students and professionals with coding, careers, interview prep, and roadmaps.
    Be encouraging, concise, and highly informative.
    
    Conversation History:
    {history_text}
    
    User: {message}
    Mentor:
    """
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Error with mentor chat: {e}")
        return "I'm having trouble thinking right now. Please try again later."

def analyze_resume(resume_text: str, job_description: str) -> dict:
    """
    Analyzes a resume against a job description using Gemini.
    """
    if not api_key:
        return {
            "ats_score": 85,
            "missing_keywords": ["Python", "FastAPI", "React"],
            "suggestions": ["Add more metrics to your impact statements.", "Include a link to your GitHub."],
            "weak_areas": ["Backend architecture experience is light."]
        }
    
    prompt = f"""
    You are an expert Technical Recruiter and ATS system.
    Evaluate the following resume against the provided job description.
    
    Job Description:
    {job_description if job_description else 'Generic Software Engineering Role'}
    
    Resume Text:
    {resume_text}
    
    Return EXCLUSIVELY a valid JSON object with:
    {{
        "ats_score": 85,
        "missing_keywords": ["List", "of", "missing", "skills"],
        "suggestions": ["Actionable improvement 1", "Actionable improvement 2"],
        "weak_areas": ["Weakness 1", "Weakness 2"]
    }}
    Ensure no markdown backticks.
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error analyzing resume: {e}")
        return {"error": "Failed to analyze resume."}

def generate_assessment_questions(topic: str) -> dict:
    """
    Generates assessment questions dynamically using Gemini.
    """
    if not api_key:
        return {
            "questions": [
                {
                    "question": f"What is a key concept in {topic}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 1
                },
                {
                    "question": f"Which of the following is true about {topic}?",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct": 2
                }
            ]
        }
        
    prompt = f"""
    You are an expert technical interviewer. Create a 5-question multiple choice assessment on the topic: "{topic}".
    The questions should range from beginner to advanced.
    
    Return EXCLUSIVELY a valid JSON object in this format:
    {{
        "questions": [
            {{
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct": 0
            }}
        ]
    }}
    Ensure no markdown backticks.
    """
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())
    except Exception as e:
        print(f"Error generating assessment: {e}")
        return {"error": "Failed to generate assessment."}
