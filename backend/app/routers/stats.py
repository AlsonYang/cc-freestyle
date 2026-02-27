from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Task, TaskPriority, TaskStatus
from app.schemas import ByPriority, ByStatus, StatsResponse

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    all_tasks = db.query(Task).all()
    total = len(all_tasks)

    status_counts = {s: 0 for s in TaskStatus}
    priority_counts = {p: 0 for p in TaskPriority}

    for task in all_tasks:
        status_counts[task.status] += 1
        priority_counts[task.priority] += 1

    return StatsResponse(
        total=total,
        by_status=ByStatus(
            todo=status_counts[TaskStatus.todo],
            in_progress=status_counts[TaskStatus.in_progress],
            done=status_counts[TaskStatus.done],
        ),
        by_priority=ByPriority(
            low=priority_counts[TaskPriority.low],
            medium=priority_counts[TaskPriority.medium],
            high=priority_counts[TaskPriority.high],
        ),
    )
