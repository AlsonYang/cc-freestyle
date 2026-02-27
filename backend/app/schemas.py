from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models import TaskPriority, TaskStatus


# ---------------------------------------------------------------------------
# Category schemas
# ---------------------------------------------------------------------------


class CategoryCreate(BaseModel):
    name: str
    color: str


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    color: str
    created_at: datetime


# ---------------------------------------------------------------------------
# Task schemas
# ---------------------------------------------------------------------------


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    due_date: Optional[date] = None
    category_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None
    category_id: Optional[int] = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[date]
    category_id: Optional[int]
    category: Optional[CategoryResponse]
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Stats schema
# ---------------------------------------------------------------------------


class ByStatus(BaseModel):
    todo: int
    in_progress: int
    done: int


class ByPriority(BaseModel):
    low: int
    medium: int
    high: int


class StatsResponse(BaseModel):
    total: int
    by_status: ByStatus
    by_priority: ByPriority
