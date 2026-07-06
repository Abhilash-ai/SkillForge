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
    coins = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    last_login_date = Column(DateTime(timezone=True), nullable=True)
    rank = Column(String, default="Apprentice")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Profile Extensions
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    github_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    interests = Column(Text, nullable=True) # JSON array of strings
    topics = Column(Text, nullable=True) # JSON array of strings
    profile_icon = Column(String, default="User") # Icon name

    roadmaps = relationship("Roadmap", back_populates="user")
    missions = relationship("UserMissionProgress", back_populates="user")
    assessments = relationship("AssessmentScore", back_populates="user")
    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")

class DSAQuestion(Base):
    __tablename__ = "dsa_questions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    difficulty = Column(String) # Easy, Medium, Hard
    description = Column(Text)
    starter_code = Column(Text)
    test_cases = Column(Text) # JSON string of test cases

class BattleRecord(Base):
    __tablename__ = "battle_records"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("dsa_questions.id"))
    challenger_id = Column(Integer, ForeignKey("users.id"))
    opponent_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    challenger_time_ms = Column(Integer, nullable=True)
    opponent_time_ms = Column(Integer, nullable=True)
    status = Column(String, default="pending") # pending, completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    question = relationship("DSAQuestion")
    challenger = relationship("User", foreign_keys=[challenger_id])
    opponent = relationship("User", foreign_keys=[opponent_id])

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



class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    category = Column(String)  # 'discussions', 'teams', 'study'
    tags = Column(String)  # comma separated
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    replies = relationship("CommunityReply", back_populates="post", cascade="all, delete-orphan")

class CommunityReply(Base):
    __tablename__ = "community_replies"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("community_posts.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    post = relationship("CommunityPost", back_populates="replies")
    user = relationship("User")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="New Chat")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    role = Column(String) # 'user' or 'model'
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    session = relationship("ChatSession", back_populates="messages")
