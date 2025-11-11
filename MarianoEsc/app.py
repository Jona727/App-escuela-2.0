import sys
sys.tracebacklimit = 1
from fastapi import FastAPI
from routes.user import user  
from routes.userdetail import UserDetail
from routes.curso import curso
from routes.career import career
from routes.payment import payment
from routes.asignacion import asignacion
from fastapi.middleware.cors import CORSMiddleware


api_escu = FastAPI()


api_escu.include_router(user)
api_escu.include_router(UserDetail)
api_escu.include_router(curso)
api_escu.include_router(career)
api_escu.include_router(payment)
api_escu.include_router(asignacion)


api_escu.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],         
    allow_headers=["*"],
)