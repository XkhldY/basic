from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import auth, admin
from models import user, audit_log, system_settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Job Platform API",
    description="A job platform API with authentication for employers and candidates",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(admin.router)

@app.get("/")
def read_root():
    return {"message": "Job Platform API", "version": "1.0.0"}
