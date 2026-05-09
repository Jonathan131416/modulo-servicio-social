from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.domain.entities.usuario import Usuario
from app.domain.ports.repositories import UsuarioRepository
import os

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class AuthUseCases:
    def __init__(self, repo: UsuarioRepository):
        self.repo = repo
        self.secret = os.getenv("JWT_SECRET", "secret")
        self.expires_hours = int(os.getenv("JWT_EXPIRES_HOURS", 24))

    def registrar(self, datos: dict) -> dict:
        if self.repo.buscar_por_email(datos["email"]):
            raise ValueError("El email ya está registrado")
        password_hash = pwd_context.hash(datos["password"])
        usuario = Usuario(
            nombre=datos["nombre"],
            email=datos["email"],
            password_hash=password_hash,
            rol=datos["rol"],
            matricula=datos.get("matricula")
        )
        guardado = self.repo.guardar(usuario)
        token = self._generar_token(guardado)
        return {"usuario": self._sanitizar(guardado), "token": token}

    def login(self, email: str, password: str) -> dict:
        usuario = self.repo.buscar_por_email(email)
        if not usuario or not pwd_context.verify(password, usuario.password_hash):
            raise ValueError("Credenciales inválidas")
        token = self._generar_token(usuario)
        return {"usuario": self._sanitizar(usuario), "token": token}

    def _generar_token(self, usuario: Usuario) -> str:
        expire = datetime.utcnow() + timedelta(hours=self.expires_hours)
        payload = {"id": usuario.id, "email": usuario.email, "rol": usuario.rol, "exp": expire}
        return jwt.encode(payload, self.secret, algorithm="HS256")

    def _sanitizar(self, usuario: Usuario) -> dict:
        return {"id": usuario.id, "nombre": usuario.nombre, "email": usuario.email, "rol": usuario.rol, "matricula": usuario.matricula}
