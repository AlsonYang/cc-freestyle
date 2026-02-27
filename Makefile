.PHONY: go be fe install install-be install-fe

# Run both backend and frontend concurrently
go:
	@trap 'kill 0' INT; \
	(cd backend && uv run uvicorn main:app --reload --port 8000) & \
	(cd frontend && npm run dev) & \
	wait

# Backend only
be:
	cd backend && uv run uvicorn main:app --reload --port 8000

# Frontend only
fe:
	cd frontend && npm run dev

# Install all dependencies
install: install-be install-fe

install-be:
	cd backend && uv sync

install-fe:
	cd frontend && npm install
