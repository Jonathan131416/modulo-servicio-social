from abc import ABC, abstractmethod
from typing import Optional, List
from app.domain.entities.solicitud import Solicitud
from app.domain.entities.usuario import Usuario

class SolicitudRepository(ABC):
    @abstractmethod
    def guardar(self, solicitud: Solicitud) -> Solicitud: pass
    @abstractmethod
    def buscar_por_id(self, id: int) -> Optional[Solicitud]: pass
    @abstractmethod
    def buscar_por_alumno(self, alumno_id: int) -> List[Solicitud]: pass
    @abstractmethod
    def listar_todas(self, estado: Optional[str] = None) -> List[Solicitud]: pass
    @abstractmethod
    def actualizar(self, solicitud: Solicitud) -> Solicitud: pass

class UsuarioRepository(ABC):
    @abstractmethod
    def guardar(self, usuario: Usuario) -> Usuario: pass
    @abstractmethod
    def buscar_por_email(self, email: str) -> Optional[Usuario]: pass
    @abstractmethod
    def buscar_por_id(self, id: int) -> Optional[Usuario]: pass
