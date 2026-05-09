from app.domain.ports.repositories import UsuarioRepository
from app.domain.entities.usuario import Usuario
from typing import Optional

class MySQLUsuarioRepository(UsuarioRepository):
    def __init__(self, connection):
        self.conn = connection

    def _mapear(self, row) -> Usuario:
        return Usuario(
            id=row["id"], nombre=row["nombre"], email=row["email"],
            password_hash=row["password_hash"], rol=row["rol"],
            matricula=row["matricula"], creado_en=row["creado_en"]
        )

    def guardar(self, u: Usuario) -> Usuario:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(
            "INSERT INTO usuarios (nombre, email, password_hash, rol, matricula) VALUES (%s, %s, %s, %s, %s)",
            (u.nombre, u.email, u.password_hash, u.rol, u.matricula)
        )
        self.conn.commit()
        return self.buscar_por_id(cursor.lastrowid)

    def buscar_por_email(self, email: str) -> Optional[Usuario]:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
        row = cursor.fetchone()
        return self._mapear(row) if row else None

    def buscar_por_id(self, id: int) -> Optional[Usuario]:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
        row = cursor.fetchone()
        return self._mapear(row) if row else None
