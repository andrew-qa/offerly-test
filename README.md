# Offerly

Offer management system with a FastAPI backend and a Vite + React frontend.

## Prerequisites

- macOS or Linux
- Git
- Python 3.13
- Poetry
- Node.js 22

## Install Tooling

### Node.js (via nvm)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash

# Restart your shell, then:
nvm install 22
nvm use 22
```

### Python 3.13 (via pyenv)

```bash
brew install pyenv
pyenv install 3.13.1
pyenv global 3.13.1
```

### Poetry (via pipx)

```bash
brew install pipx
pipx ensurepath

# Restart your shell, then:
pipx install poetry
```

## Setup

```bash
git clone <your-repo-url>
cd offerly
```

## Run With Docker (Recommended)

```bash
docker build -t offerly .
docker run --rm -p 8000:8000 -p 5173:5173 offerly
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- UI: http://localhost:5173

### Backend

```bash
cd backend
poetry install
```

Run the backend:

```bash
poetry run uvicorn app.main:app --reload
```

The API will be available at:

- http://localhost:8000
- Docs: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at:

- http://localhost:5173

## Tests

Run backend tests from the repo root:

```bash
cd backend
poetry run pytest
```

## Notes

- The backend uses SQLite by default and creates tables on startup.
- If you change Node or Python versions, re-run the install steps.
