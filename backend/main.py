from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.infrastructure.config.database import get_connection
from app.infrastructure.adapters.db.mysql_solicitud_repository import MySQLSolicitudRepository
from app.infrastructure.adapters.db.mysql_usuario_repository import MySQLUsuarioRepository
from app.application.use_cases.solicitud_use_cases import SolicitudUseCases
from app.application.use_cases.auth_use_cases import AuthUseCases
from app.infrastructure.adapters.http.auth_routes import create_auth_router
from app.infrastructure.adapters.http.solicitud_routes import create_solicitud_router

app = FastAPI(title="Servicio Social UNACH", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexión DB
conn = get_connection()
print("✅ MySQL conectado:", os.getenv("DB_NAME"))

# Repositorios
solicitud_repo = MySQLSolicitudRepository(conn)
usuario_repo = MySQLUsuarioRepository(conn)

# Casos de uso
solicitud_uc = SolicitudUseCases(solicitud_repo)
auth_uc = AuthUseCases(usuario_repo)

# Rutas
app.include_router(create_auth_router(auth_uc))
app.include_router(create_solicitud_router(solicitud_uc))

@app.get("/health")
def health():
    return {"servicio": "servicio-social", "estado": "ok", "puerto": os.getenv("PORT", "8004")}
