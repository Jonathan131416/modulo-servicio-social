from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional

@dataclass
class Solicitud:
    alumno_id: int
    nombre: str
    matricula: str
    carrera: str
    semestre: str
    institucion: str
    fecha_inicio: date
    fecha_termino: date
    actividades: str
    id: Optional[int] = None
    estado: str = "pendiente"
    creado_en: Optional[datetime] = None

    def aprobar(self):
        if self.estado not in ("pendiente", "en_revision"):
            raise ValueError("Solo se pueden aprobar solicitudes pendientes o en revisión")
        self.estado = "aprobada"

    def rechazar(self):
        if self.estado == "aprobada":
            raise ValueError("No se puede rechazar una solicitud ya aprobada")
        self.estado = "rechazada"

    def poner_en_revision(self):
        self.estado = "en_revision"
