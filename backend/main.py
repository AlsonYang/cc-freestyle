from contextlib import asynccontextmanager
from datetime import date

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, SessionLocal, engine
from app.models import Category, Task, TaskPriority, TaskStatus
from app.routers import categories, stats, tasks


def seed_database():
    db = SessionLocal()
    try:
        # Only seed if no categories exist yet
        if db.query(Category).count() > 0:
            return

        # Seed sample categories
        work = Category(name="Work", color="#6366f1")
        personal = Category(name="Personal", color="#22c55e")
        urgent = Category(name="Urgent", color="#ef4444")
        db.add_all([work, personal, urgent])
        db.flush()  # Flush to get IDs assigned before creating tasks

        # Seed 5 sample tasks spread across statuses and priorities
        sample_tasks = [
            Task(
                title="Set up project repository",
                description="Initialize git repo, configure CI/CD pipeline, and set up branch protection rules.",
                status=TaskStatus.done,
                priority=TaskPriority.high,
                due_date=date(2026, 1, 15),
                category_id=work.id,
            ),
            Task(
                title="Write API documentation",
                description="Document all REST endpoints with request/response examples using OpenAPI spec.",
                status=TaskStatus.in_progress,
                priority=TaskPriority.medium,
                due_date=date(2026, 3, 1),
                category_id=work.id,
            ),
            Task(
                title="Fix critical auth bug",
                description="Users are being logged out unexpectedly. Investigate JWT refresh token flow.",
                status=TaskStatus.todo,
                priority=TaskPriority.high,
                due_date=date(2026, 2, 28),
                category_id=urgent.id,
            ),
            Task(
                title="Schedule dentist appointment",
                description=None,
                status=TaskStatus.todo,
                priority=TaskPriority.low,
                due_date=date(2026, 3, 15),
                category_id=personal.id,
            ),
            Task(
                title="Refactor database queries",
                description="Optimize slow queries identified in the performance audit. Add indexes where needed.",
                status=TaskStatus.in_progress,
                priority=TaskPriority.medium,
                due_date=None,
                category_id=work.id,
            ),
        ]
        db.add_all(sample_tasks)
        db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and seed data
    Base.metadata.create_all(bind=engine)
    seed_database()
    yield
    # Shutdown: nothing special needed for SQLite


app = FastAPI(
    title="Task Management API",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers under /api prefix
app.include_router(tasks.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(stats.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Task Management API", "docs": "/docs", "redoc": "/redoc"}
