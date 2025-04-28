from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apps.calculator.route import router as calculator_router
from auth.router import router as auth_router
from constants import SERVER_URL, PORT, ENV

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(calculator_router, prefix="/calculator", tags=["calculator"])

@app.get("/")
async def health():
    return {'message': 'Server is running'}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=SERVER_URL, port=int(PORT), reload=(ENV == "dev"))



