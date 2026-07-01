from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    clerk_id = Column(String, unique=True, index=True)
    education_level = Column(String)
    dream_career = Column(String)
    time_commitment = Column(String)
    xp_points = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    rank = Column(String, default="Apprentice")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    roadmaps = relationship("Roadmap", back_populates="user")
    missions = relationship("UserMissionProgress", back_populates="user")
    assessments = relationship("AssessmentScore", back_populates="user")

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    career = Column(String)
    description = Column(String)
    estimated_months = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

    user = relationship("User", back_populates="roadmaps")
    milestones = relationship("RoadmapMilestone", back_populates="roadmap", cascade="all, delete-orphan")

class RoadmapMilestone(Base):
    __tablename__ = "roadmap_milestones"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_id = Column(Integer, ForeignKey("roadmaps.id"))
    title = Column(String)
    duration = Column(String)
    order_index = Column(Integer)
    is_completed = Column(Boolean, default=False)
    
    # Store as comma-separated strings or JSON string for MVP
    tasks = Column(Text) 
    projects = Column(Text)

    roadmap = relationship("Roadmap", back_populates="milestones")

class DailyMission(Base):
    __tablename__ = "daily_missions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    xp_reward = Column(Integer)
    active_date = Column(DateTime(timezone=True), server_default=func.now())

    user_progress = relationship("UserMissionProgress", back_populates="mission")

class UserMissionProgress(Base):
    __tablename__ = "user_mission_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mission_id = Column(Integer, ForeignKey("daily_missions.id"))
    progress_percentage = Column(Integer, default=0)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="missions")
    mission = relationship("DailyMission", back_populates="user_progress")

class AssessmentScore(Base):
    __tablename__ = "assessment_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String)
    score_percentage = Column(Integer)
    xp_earned = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="assessments")

