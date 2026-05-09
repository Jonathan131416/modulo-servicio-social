from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

bearer = HTTPBearer()

def verificar_token(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
    try:
        payload = jwt.decode(credentials.credentials, os.getenv("JWT_SECRET", "secret"), algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token inválido o expirado")

def solo_coordinador(payload: dict = Depends(verificar_token)):
    if payload.get("rol") != "coordinador":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso restringido a coordinadores")
    return payload

def solo_alumno(payload: dict = Depends(verificar_token)):
    if payload.get("rol") != "alumno":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acceso restringido a alumnos")
    return payload
