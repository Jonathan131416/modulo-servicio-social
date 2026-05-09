from app.domain.entities.solicitud import Solicitud
from app.domain.ports.repositories import SolicitudRepository
from typing import Optional, List

class SolicitudUseCases:
    def __init__(self, repo: SolicitudRepository):
        self.repo = repo

    def crear(self, datos: dict, alumno_id: int) -> Solicitud:
        solicitud = Solicitud(alumno_id=alumno_id, **datos)
        return self.repo.guardar(solicitud)

    def mis_solicitudes(self, alumno_id: int) -> List[Solicitud]:
        return self.repo.buscar_por_alumno(alumno_id)

    def todas(self, estado: Optional[str] = None) -> List[Solicitud]:
        return self.repo.listar_todas(estado)

    def obtener(self, id: int) -> Solicitud:
        s = self.repo.buscar_por_id(id)
        if not s:
            raise ValueError("Solicitud no encontrada")
        return s

    def aprobar(self, id: int) -> Solicitud:
        s = self.obtener(id)
        s.aprobar()
        return self.repo.actualizar(s)

    def rechazar(self, id: int) -> Solicitud:
        s = self.obtener(id)
        s.rechazar()
        return self.repo.actualizar(s)

    def poner_en_revision(self, id: int) -> Solicitud:
        s = self.obtener(id)
        s.poner_en_revision()
        return self.repo.actualizar(s)
