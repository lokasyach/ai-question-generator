from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from models.database import init_db
import os
import sentry_sdk

load_dotenv()

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    traces_sample_rate=1.0,
)

app = FastAPI(
    title=os.getenv("APP_NAME", "AI Question Generator"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="AI-powered quiz generator from PDFs and documents",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
init_db()

# Include routers
from routers import auth
app.include_router(auth.router)

@app.get("/")
async def root():
    return {
        "message": "AI Question Generator API is running!",
        "version": os.getenv("APP_VERSION", "1.0.0"),
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}