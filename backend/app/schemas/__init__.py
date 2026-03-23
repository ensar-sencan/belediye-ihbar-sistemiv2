"""
Schemas initialization
"""
from .user import User, UserCreate, UserUpdate, UserInDB
from .municipality import Municipality, MunicipalityCreate, MunicipalityUpdate
from .report import Report, ReportCreate, ReportUpdate
from . comment import Comment, CommentCreate, CommentUpdate
from .vote import Vote, VoteCreate

__all__ = [
    "User", "UserCreate", "UserUpdate", "UserInDB",
    "Municipality", "MunicipalityCreate", "MunicipalityUpdate",
    "Report", "ReportCreate", "ReportUpdate",
    "Comment", "CommentCreate", "CommentUpdate",
    "Vote", "VoteCreate"
]