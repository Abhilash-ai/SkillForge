from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone

import models
import schemas
from database import engine, get_db

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillForge API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    from forge_service import seed_dsa_questions
    seed_dsa_questions(db)


# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    from ai_service import api_key
    return {
        "message": "Welcome to SkillForge API",
        "ai_configured": bool(api_key)
    }

def get_or_create_user(clerk_id: str, db: Session):
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    
    now_utc = datetime.now(timezone.utc)
    
    if not user:
        user = models.User(
            clerk_id=clerk_id,
            last_login_date=now_utc,
            coins=5,
            current_streak=1
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        last_login = user.last_login_date
        if not last_login or last_login.date() < now_utc.date():
            user.coins = (user.coins or 0) + 5
            if last_login and (now_utc.date() - last_login.date()).days == 1:
                user.current_streak = (user.current_streak or 0) + 1
            else:
                user.current_streak = 1
            user.last_login_date = now_utc
            db.commit()
            db.refresh(user)
            
    return user

@app.post("/api/onboarding", response_model=schemas.User)
def save_onboarding(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.clerk_id == user_data.clerk_id).first()
    if db_user:
        # Update existing user preferences instead of ignoring
        db_user.education_level = user_data.education_level
        db_user.dream_career = user_data.dream_career
        db_user.time_commitment = user_data.time_commitment
        db.commit()
        db.refresh(db_user)
        return db_user
    
    new_user = models.User(**user_data.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/api/users/{clerk_id}/dashboard")
def get_user_dashboard(clerk_id: str, db: Session = Depends(get_db)):
    user = get_or_create_user(clerk_id, db)
    
    # In a real app, daily missions would be rotated and assigned via cron jobs.
    # For MVP, we fetch existing ones or return empty list.
    missions = db.query(models.UserMissionProgress).filter(models.UserMissionProgress.user_id == user.id).all()
    
    # Active roadmap
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user.id, 
        models.Roadmap.is_active == True
    ).first()

    roadmap_data = None
    if active_roadmap:
        completed = sum(1 for m in active_roadmap.milestones if m.is_completed)
        total = len(active_roadmap.milestones)
        roadmap_data = {
            "career": active_roadmap.career,
            "progress_percentage": int((completed / total) * 100) if total > 0 else 0,
            "stage_text": f"Stage {completed + 1} of {total}" if completed < total else "Completed"
        }

    return {
        "user": user,
        "missions": missions,
        "roadmap": roadmap_data,
        "achievements": [] # Placeholder for now
    }

class AssessmentSubmit(BaseModel):
    clerk_id: str
    topic: str
    score_percentage: int

def update_user_rank(xp: int):
    if xp >= 5000: return "Grandmaster"
    if xp >= 2500: return "Master Smith"
    if xp >= 1000: return "Artisan"
    if xp >= 300: return "Craftsman"
    return "Apprentice"

@app.post("/api/assessments/submit")
def submit_assessment(data: AssessmentSubmit, db: Session = Depends(get_db)):
    user = get_or_create_user(data.clerk_id, db)
    
    # XP formula based on percentage
    xp_earned = int((data.score_percentage / 100) * 100)
    
    # Save score
    score = models.AssessmentScore(
        user_id=user.id,
        topic=data.topic,
        score_percentage=data.score_percentage,
        xp_earned=xp_earned
    )
    db.add(score)
    
    # Update user XP and Rank
    user.xp_points += xp_earned
    user.rank = update_user_rank(user.xp_points)
    
    db.commit()
    db.refresh(user)
    
    return {"message": "Score saved successfully", "xp_earned": xp_earned, "new_rank": user.rank, "total_xp": user.xp_points}

from ai_service import get_career_insights, generate_career_roadmap, generate_assessment_questions

@app.get("/api/careers/{career_name:path}")
def fetch_career_insights(career_name: str):
    insights = get_career_insights(career_name)
    if "error" in insights:
        raise HTTPException(status_code=500, detail=insights["error"])
    return insights

@app.get("/api/assessments/questions")
def get_assessment_questions(topic: str):
    data = generate_assessment_questions(topic)
    if "error" in data:
        raise HTTPException(status_code=500, detail=data["error"])
    return data

from typing import Optional

class RoadmapRequest(BaseModel):
    clerk_id: str
    career: Optional[str] = None
    education_level: Optional[str] = None
    time_commitment: Optional[str] = None

import json

@app.post("/api/roadmaps/generate")
def create_roadmap(req: RoadmapRequest, db: Session = Depends(get_db)):
    user = get_or_create_user(req.clerk_id, db)
    
    career = req.career or user.dream_career or "Software Engineer"
    education_level = req.education_level or user.education_level or "Beginner"
    time_commitment = req.time_commitment or user.time_commitment or "2 hours/day"
        
    roadmap_data = generate_career_roadmap(career, education_level, time_commitment)
    if "error" in roadmap_data:
        raise HTTPException(status_code=500, detail=roadmap_data["error"])
        
    # Deactivate current roadmaps
    db.query(models.Roadmap).filter(models.Roadmap.user_id == user.id).update({"is_active": False})
    
    # Create new Roadmap
    db_roadmap = models.Roadmap(
        user_id=user.id,
        career=roadmap_data.get("career", req.career),
        description=roadmap_data.get("description", ""),
        estimated_months=roadmap_data.get("estimated_months", 6),
        is_active=True
    )
    db.add(db_roadmap)
    db.commit()
    db.refresh(db_roadmap)
    
    # Create Milestones
    for idx, ms in enumerate(roadmap_data.get("milestones", [])):
        db_ms = models.RoadmapMilestone(
            roadmap_id=db_roadmap.id,
            title=ms.get("title", ""),
            duration=ms.get("duration", ""),
            order_index=idx,
            tasks=json.dumps(ms.get("tasks", [])),
            projects=json.dumps(ms.get("projects", []))
        )
        db.add(db_ms)
        
    db.commit()
    
    return roadmap_data

@app.get("/api/users/{clerk_id}/roadmap")
def get_user_roadmap(clerk_id: str, db: Session = Depends(get_db)):
    user = get_or_create_user(clerk_id, db)
        
    active_roadmap = db.query(models.Roadmap).filter(
        models.Roadmap.user_id == user.id, 
        models.Roadmap.is_active == True
    ).first()
    
    if not active_roadmap:
        return None
        
    # Reconstruct roadmap_data
    roadmap_data = {
        "career": active_roadmap.career,
        "description": active_roadmap.description,
        "estimated_months": active_roadmap.estimated_months,
        "milestones": []
    }
    
    for ms in active_roadmap.milestones:
        roadmap_data["milestones"].append({
            "id": ms.id,
            "title": ms.title,
            "duration": ms.duration,
            "is_completed": ms.is_completed,
            "tasks": json.loads(ms.tasks) if ms.tasks else [],
            "projects": json.loads(ms.projects) if ms.projects else []
        })
        
    return roadmap_data

from execution_service import execute_code

class ExecuteRequest(BaseModel):
    language: str
    code: str

@app.post("/api/execute")
async def run_code(req: ExecuteRequest):
    result = await execute_code(req.language, req.code)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage]

from ai_service import chat_with_mentor, analyze_resume
from fastapi import UploadFile, File, Form
import PyPDF2
import io

@app.post("/api/mentor/chat")
def mentor_chat(req: ChatRequest):
    reply = chat_with_mentor(req.message, [h.dict() for h in req.history])
    return {"reply": reply}

@app.post("/api/resume/analyze")
async def process_resume(file: UploadFile = File(...), job_description: str = Form("")):
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() + "\n"
        
        result = analyze_resume(text, job_description)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process resume: {str(e)}")

# ==========================================
# COMMUNITY ENDPOINTS
# ==========================================

from sqlalchemy.orm import joinedload

@app.get("/api/community/posts", response_model=List[schemas.CommunityPost])
def get_community_posts(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.CommunityPost).options(joinedload(models.CommunityPost.user), joinedload(models.CommunityPost.replies).joinedload(models.CommunityReply.user))
    if category and category != "all":
        query = query.filter(models.CommunityPost.category == category)
    return query.order_by(models.CommunityPost.created_at.desc()).all()

@app.post("/api/community/posts", response_model=schemas.CommunityPost)
def create_community_post(post: schemas.CommunityPostCreate, clerk_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_post = models.CommunityPost(**post.dict(), user_id=user.id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.get("/api/community/posts/{post_id}", response_model=schemas.CommunityPost)
def get_community_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.CommunityPost).options(joinedload(models.CommunityPost.user), joinedload(models.CommunityPost.replies).joinedload(models.CommunityReply.user)).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/api/community/posts/{post_id}/replies", response_model=schemas.CommunityReply)
def create_community_reply(post_id: int, reply: schemas.CommunityReplyCreate, clerk_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    post = db.query(models.CommunityPost).filter(models.CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    db_reply = models.CommunityReply(**reply.dict(), post_id=post_id, user_id=user.id)
    db.add(db_reply)
    db.commit()
    db.refresh(db_reply)
    return db_reply

@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    users = db.query(models.User).order_by(models.User.id.desc()).limit(10).all()
    total_users = db.query(models.User).count()
    return {
        "total_users": total_users,
        "recent_users": [
            {
                "id": u.clerk_id,
                "email": f"user_{u.id}@skillforge.local", # placeholder since we don't store email in basic model
                "target_role": u.dream_career or "Undecided",
                "joined": "Recently"
            } for u in users
        ]
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=10000, reload=True)

# ==========================================
# ARENA / BATTLE GROUND ENDPOINTS
# ==========================================

from pydantic import BaseModel as PydanticBaseModel

class CodeSubmission(PydanticBaseModel):
    code: str

@app.get("/api/arena/questions", response_model=List[schemas.DSAQuestion])
def get_dsa_questions(db: Session = Depends(get_db)):
    return db.query(models.DSAQuestion).all()

@app.get("/api/arena/questions/{question_id}", response_model=schemas.DSAQuestion)
def get_dsa_question(question_id: int, db: Session = Depends(get_db)):
    q = db.query(models.DSAQuestion).filter(models.DSAQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
    return q

@app.post("/api/arena/questions/{question_id}/submit")
def submit_solution(question_id: int, submission: CodeSubmission, clerk_id: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.clerk_id == clerk_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    q = db.query(models.DSAQuestion).filter(models.DSAQuestion.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")
        
    from forge_service import evaluate_code
    passed, message = evaluate_code(submission.code, q.test_cases)
    
    if passed:
        # Give reward
        user.xp_points = (user.xp_points or 0) + 50
        user.coins = (user.coins or 0) + 10
        db.commit()
        
    return {"passed": passed, "message": message, "xp_earned": 50 if passed else 0, "coins_earned": 10 if passed else 0}

@app.get("/api/arena/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    # Returns top 50 users by XP
    users = db.query(models.User).order_by(models.User.xp_points.desc()).limit(50).all()
    return [{"clerk_id": u.clerk_id, "rank": u.rank, "xp_points": u.xp_points, "coins": u.coins, "streak": u.current_streak} for u in users]
