FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_NO_INTERACTION=1

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl ca-certificates \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir poetry

COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY start.sh ./start.sh

RUN chmod +x /app/start.sh

WORKDIR /app/backend
RUN poetry install --no-root

WORKDIR /app/frontend
RUN npm install

EXPOSE 8000 5173

WORKDIR /app
CMD ["/app/start.sh"]
