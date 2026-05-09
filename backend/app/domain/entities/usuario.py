from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class Usuario:
    nombre: str
    email: str
    password_hash: str
    rol: str  # 'alumno' | 'coordinador'
    id: Optional[int] = None
    matricula: Optional[str] = None
    creado_en: Optional[datetime] = None

    def es_coordinador(self):
        return self.rol == "coordinador"

    def es_alumno(self):
        return self.rol == "alumno"
