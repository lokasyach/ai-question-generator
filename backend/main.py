from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sentry_sdk

# Load environment variables
load_dotenv()

# Initialize Sentry for error tracking
sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN", ""),
    traces_sample_rate=1.0,
)

# Create FastAPI app
app = FastAPI(
    title=os.getenv("APP_NAME", "AI Question Generator"),
    version=os.getenv("APP_VERSION", "1.0.0"),
    description="AI-powered quiz generator from PDFs and documents",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
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