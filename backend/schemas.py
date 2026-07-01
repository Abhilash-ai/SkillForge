from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class UserBase(BaseModel):
    clerk_id: str
    education_level: str
    dream_career: str
    time_commitment: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    xp_points: int
    current_streak: int
    rank: str
    created_at: datetime

    class Config:
        from_attributes = True

class RoadmapMilestoneBase(BaseModel):
    title: str
    duration: str
    order_index: int
    is_completed: bool
    tasks: str
    projects: str

class RoadmapMilestoneCreate(RoadmapMilestoneBase):
    pass

class RoadmapMilestone(RoadmapMilestoneBase):
    id: int
    roadmap_id: int
    class Config:
        from_attributes = True

class RoadmapBase(BaseModel):
    career: str
    description: str
    estimated_months: int
    is_active: bool

class RoadmapCreate(RoadmapBase):
    pass

class Roadmap(RoadmapBase):
    id: int
    user_id: int
    created_at: datetime
    milestones: List[RoadmapMilestone] = []
    
    class Config:
        from_attributes = True

class DailyMissionBase(BaseModel):
    title: str
    description: str
    xp_reward: int

class DailyMission(DailyMissionBase):
    id: int
    active_date: datetime
    class Config:
        from_attributes = True

class UserMissionProgressBase(BaseModel):
    progress_percentage: int
    is_completed: bool

class UserMissionProgress(UserMissionProgressBase):
    id: int
    user_id: int
    mission_id: int
    mission: DailyMission
    class Config:
        from_attributes = True

class AssessmentScoreBase(BaseModel):
    topic: str
    score_percentage: int
    xp_earned: int

class AssessmentScoreCreate(AssessmentScoreBase):
    pass

class AssessmentScore(AssessmentScoreBase):
    id: int
    user_id: int
    created_at: datetime
    class Config:
        from_attributes = True

class CommunityReplyBase(BaseModel):
    content: str

class CommunityReplyCreate(CommunityReplyBase):
    pass

class CommunityReply(CommunityReplyBase):
    id: int
    post_id: int
    user_id: int
    created_at: datetime
    user: Optional[User] = None
    class Config:
        from_attributes = True

class CommunityPostBase(BaseModel):
    title: str
    content: str
    category: str
    tags: str

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPost(CommunityPostBase):
    id: int
    user_id: int
    created_at: datetime
    user: Optional[User] = None
    replies: List[CommunityReply] = []
    class Config:
        from_attributes = True
