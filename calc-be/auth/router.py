from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
import json
from typing import Optional
import ssl
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.Drawcal
users_collection = db.users
sessions_collection = db.sessions

router = APIRouter()
security = HTTPBearer()

# Configure Google OAuth2
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

# Configure the OAuth2 flow
flow = Flow.from_client_config(
    {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [REDIRECT_URI],
            "javascript_origins": [os.getenv("FRONTEND_URL", "http://localhost:5173")]
        }
    },
    scopes=["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
    redirect_uri=REDIRECT_URI
)

# Disable SSL verification for development
ssl._create_default_https_context = ssl._create_unverified_context

class User(BaseModel):
    email: str
    name: str
    role: str = "user"
    created_at: datetime = datetime.utcnow()
    last_login: datetime = datetime.utcnow()

class Session(BaseModel):
    user_id: str
    token: str
    created_at: datetime = datetime.utcnow()
    expires_at: datetime
    is_active: bool = True

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenData(BaseModel):
    sub: str
    name: str
    role: str
    exp: Optional[datetime] = None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> TokenData:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(**payload)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/verify")
async def verify_token(current_user: TokenData = Depends(get_current_user)):
    """Verify the current session token"""
    try:
        # Find active session
        session = await sessions_collection.find_one({
            "user_id": current_user.sub,
            "is_active": True,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not session:
            raise HTTPException(status_code=401, detail="Session expired or invalid")
            
        # Find user
        user = await users_collection.find_one({"email": current_user.sub})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
            
        # Update last login time
        await users_collection.update_one(
            {"email": current_user.sub},
            {"$set": {"last_login": datetime.utcnow()}}
        )
            
        return {
            "success": True,
            "user": {
                "email": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Token verification failed: {str(e)}")

@router.get("/google/login")
async def google_login():
    """Initiate Google OAuth2 flow"""
    try:
        authorization_url, state = flow.authorization_url(
            access_type='offline',
            include_granted_scopes='true',
            prompt='consent'
        )
        return RedirectResponse(authorization_url)
    except Exception as e:
        print(f"Google login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to initiate Google login: {str(e)}")

@router.get("/google/callback")
async def google_callback(request: Request):
    """Handle Google OAuth2 callback"""
    try:
        auth_response = str(request.url)
        # Replace http with https in the callback URL
        auth_response = auth_response.replace('http://', 'https://')
        flow.fetch_token(authorization_response=auth_response)
        credentials = flow.credentials
        userinfo_service = build('oauth2', 'v2', credentials=credentials)
        userinfo = userinfo_service.userinfo().get().execute()
        
        # Create or update user in MongoDB
        email = userinfo['email']
        user_data = {
            "email": email,
            "name": userinfo.get('name', email),
            "role": "user",
            "last_login": datetime.utcnow()
        }
        
        # Update or insert user
        result = await users_collection.update_one(
            {"email": email},
            {"$set": user_data},
            upsert=True
        )
        
        # Create session
        access_token = create_access_token({
            "sub": email,
            "name": user_data["name"],
            "role": user_data["role"]
        })
        
        # Store session in MongoDB
        session_data = {
            "user_id": str(result.upserted_id) if result.upserted_id else email,
            "token": access_token,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=30),
            "is_active": True
        }
        await sessions_collection.insert_one(session_data)
        
        return RedirectResponse(f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/auth/callback?token={access_token}")
    except Exception as e:
        print(f"Google callback error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to complete Google login: {str(e)}")

@router.post("/login")
async def login(request: LoginRequest):
    """Handle user login"""
    try:
        # Check if user exists in MongoDB
        user = await users_collection.find_one({"email": request.username})
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Create session
        access_token = create_access_token({
            "sub": user["email"],
            "name": user["name"],
            "role": user["role"]
        })
        
        # Store session in MongoDB
        session_data = {
            "user_id": str(user["_id"]),
            "token": access_token,
            "created_at": datetime.utcnow(),
            "expires_at": datetime.utcnow() + timedelta(days=30),
            "is_active": True
        }
        await sessions_collection.insert_one(session_data)
        
        return {
            "success": True,
            "token": access_token,
            "user": {
                "username": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

def create_access_token(data: dict):
    """Create JWT token"""
    try:
        to_encode = data.copy()
        # Token expires in 30 days
        expire = datetime.utcnow() + timedelta(days=30)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create access token: {str(e)}")

@router.get("/session/check")
async def check_session(current_user: TokenData = Depends(get_current_user)):
    """Check if the current session is valid"""
    try:
        # Find active session
        session = await sessions_collection.find_one({
            "user_id": current_user.sub,
            "token": current_user.token,
            "is_active": True,
            "expires_at": {"$gt": datetime.utcnow()}
        })
        
        if not session:
            raise HTTPException(status_code=401, detail="Session expired or invalid")
            
        # Find user
        user = await users_collection.find_one({"email": current_user.sub})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
            
        return {
            "success": True,
            "user": {
                "username": user["email"],
                "name": user["name"],
                "role": user["role"]
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Session check failed: {str(e)}")

@router.post("/logout")
async def logout(current_user: TokenData = Depends(get_current_user)):
    """Logout user and invalidate session"""
    try:
        # Update session to inactive
        await sessions_collection.update_one(
            {
                "user_id": current_user.sub,
                "is_active": True
            },
            {
                "$set": {
                    "is_active": False,
                    "logged_out_at": datetime.utcnow()
                }
            }
        )
        return {"success": True, "message": "Logged out successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

@router.get("/user/profile")
async def get_user_profile(current_user: TokenData = Depends(get_current_user)):
    """Get user profile information"""
    try:
        # Find user
        user = await users_collection.find_one({"email": current_user.sub})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        return {
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "createdAt": user.get("created_at", None)
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch user profile: {str(e)}") 