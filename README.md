# Task Management App

A full-stack task management app with a FastAPI backend and React frontend.

## Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Python 3.12, FastAPI, SQLAlchemy, SQLite, UV    |
| Frontend | React 18, TypeScript, Vite, TanStack Query, shadcn/ui, Tailwind CSS |

## Quick Start

```bash
# Install all dependencies
make install

# Run backend + frontend together
make go
```

- Backend API: http://localhost:8000
- Frontend UI: http://localhost:5173
- API docs (Swagger): http://localhost:8000/docs

## Make Targets

| Target       | Description                        |
|--------------|------------------------------------|
| `make go`    | Run both backend and frontend      |
| `make be`    | Run backend only (port 8000)       |
| `make fe`    | Run frontend only (port 5173)      |
| `make install` | Install all dependencies         |
| `make install-be` | Install backend deps (uv sync) |
| `make install-fe` | Install frontend deps (npm install) |

## API Endpoints

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks` | List tasks (filterable by status, priority, category, search) |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/{id}` | Get a task |
| PUT | `/api/tasks/{id}` | Update a task |
| DELETE | `/api/tasks/{id}` | Delete a task |

### Categories
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/categories` | List categories |
| POST | `/api/categories` | Create a category |
| DELETE | `/api/categories/{id}` | Delete a category |

### Stats
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/stats` | Task counts by status and priority |

## Project Structure

```
.
├── Makefile
├── backend/
│   ├── main.py            # FastAPI app + lifespan + seed data
│   ├── pyproject.toml
│   └── app/
│       ├── database.py    # SQLAlchemy engine + session
│       ├── models.py      # Task + Category ORM models
│       ├── schemas.py     # Pydantic schemas
│       └── routers/
│           ├── tasks.py
│           ├── categories.py
│           └── stats.py
└── frontend/
    ├── index.html
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── components/    # UI components (TaskList, TaskForm, etc.)
        ├── hooks/         # TanStack Query hooks
        ├── lib/           # axios client + utils
        └── types/         # TypeScript interfaces
```
