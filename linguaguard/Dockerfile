# LinguaGuard Production Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY linguaguard/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY linguaguard /app/linguaguard
COPY .env.example /app/.env.example

# Set PYTHONPATH
ENV PYTHONPATH=/app

# Expose FastAPI and Streamlit ports
EXPOSE 8000 8501

# Default command: launch FastAPI server
CMD ["uvicorn", "linguaguard.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
