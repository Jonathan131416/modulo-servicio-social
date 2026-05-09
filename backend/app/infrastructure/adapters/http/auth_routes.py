from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/auth", tags=["auth"])

class RegistroSchema(BaseModel):
    nombre: str
    email: str
    password: str
    rol: str  # 'alumno' | 'coordinador'
    matricula: Optional[str] = None

class LoginSchema(BaseModel):
    email: str
    password: str

def create_auth_router(auth_use_cases):
    @router.post("/registro")
    def registro(datos: RegistroSchema):
        try:
            return auth_use_cases.registrar(datos.dict())
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @router.post("/login")
    def login(datos: LoginSchema):
        try:
            return auth_use_cases.login(datos.email, datos.password)
        except ValueError as e:
            raise HTTPException(status_code=401, detail=str(e))

    return router
