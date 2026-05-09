from app.domain.ports.repositories import SolicitudRepository
from app.domain.entities.solicitud import Solicitud
from typing import Optional, List

class MySQLSolicitudRepository(SolicitudRepository):
    def __init__(self, connection):
        self.conn = connection

    def _mapear(self, row) -> Solicitud:
        return Solicitud(
            id=row["id"], alumno_id=row["alumno_id"], nombre=row["nombre"],
            matricula=row["matricula"], carrera=row["carrera"], semestre=row["semestre"],
            institucion=row["institucion"], fecha_inicio=row["fecha_inicio"],
            fecha_termino=row["fecha_termino"], actividades=row["actividades"],
            estado=row["estado"], creado_en=row["creado_en"]
        )

    def guardar(self, s: Solicitud) -> Solicitud:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute(
            """INSERT INTO solicitudes (alumno_id, nombre, matricula, carrera, semestre,
               institucion, fecha_inicio, fecha_termino, actividades, estado)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
            (s.alumno_id, s.nombre, s.matricula, s.carrera, s.semestre,
             s.institucion, s.fecha_inicio, s.fecha_termino, s.actividades, s.estado)
        )
        self.conn.commit()
        return self.buscar_por_id(cursor.lastrowid)

    def buscar_por_id(self, id: int) -> Optional[Solicitud]:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM solicitudes WHERE id = %s", (id,))
        row = cursor.fetchone()
        return self._mapear(row) if row else None

    def buscar_por_alumno(self, alumno_id: int) -> List[Solicitud]:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM solicitudes WHERE alumno_id = %s ORDER BY creado_en DESC", (alumno_id,))
        return [self._mapear(r) for r in cursor.fetchall()]

    def listar_todas(self, estado: Optional[str] = None) -> List[Solicitud]:
        cursor = self.conn.cursor(dictionary=True)
        if estado:
            cursor.execute("SELECT * FROM solicitudes WHERE estado = %s ORDER BY creado_en DESC", (estado,))
        else:
            cursor.execute("SELECT * FROM solicitudes ORDER BY creado_en DESC")
        return [self._mapear(r) for r in cursor.fetchall()]

    def actualizar(self, s: Solicitud) -> Solicitud:
        cursor = self.conn.cursor(dictionary=True)
        cursor.execute("UPDATE solicitudes SET estado = %s WHERE id = %s", (s.estado, s.id))
        self.conn.commit()
        return self.buscar_por_id(s.id)
