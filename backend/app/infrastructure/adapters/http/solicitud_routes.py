from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import date
from typing import Optional
from app.infrastructure.middleware.auth import verificar_token, solo_coordinador, solo_alumno

router = APIRouter(prefix="/api/solicitudes", tags=["solicitudes"])

class SolicitudSchema(BaseModel):
    nombre: str
    matricula: str
    carrera: str
    semestre: str
    institucion: str
    fecha_inicio: date
    fecha_termino: date
    actividades: str

def solicitud_to_dict(s):
    return {
        "id": s.id,
        "alumno_id": s.alumno_id,
        "nombre": s.nombre,
        "matricula": s.matricula,
        "carrera": s.carrera,
        "semestre": s.semestre,
        "institucion": s.institucion,
        "fecha_inicio": str(s.fecha_inicio),
        "fecha_termino": str(s.fecha_termino),
        "actividades": s.actividades,
        "estado": s.estado,
        "creado_en": str(s.creado_en) if s.creado_en else None
    }

def create_solicitud_router(solicitud_use_cases):
    @router.post("/")
    def crear(datos: SolicitudSchema, payload: dict = Depends(solo_alumno)):
        try:
            return solicitud_to_dict(solicitud_use_cases.crear(datos.dict(), payload["id"]))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @router.get("/mis-solicitudes")
    def mis_solicitudes(payload: dict = Depends(solo_alumno)):
        return [solicitud_to_dict(s) for s in solicitud_use_cases.mis_solicitudes(payload["id"])]

    @router.get("/")
    def todas(estado: Optional[str] = None, payload: dict = Depends(solo_coordinador)):
        return [solicitud_to_dict(s) for s in solicitud_use_cases.todas(estado)]

    @router.get("/{id}")
    def obtener(id: int, payload: dict = Depends(verificar_token)):
        try:
            return solicitud_to_dict(solicitud_use_cases.obtener(id))
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))

    @router.patch("/{id}/aprobar")
    def aprobar(id: int, payload: dict = Depends(solo_coordinador)):
        try:
            return solicitud_to_dict(solicitud_use_cases.aprobar(id))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @router.patch("/{id}/rechazar")
    def rechazar(id: int, payload: dict = Depends(solo_coordinador)):
        try:
            return solicitud_to_dict(solicitud_use_cases.rechazar(id))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @router.patch("/{id}/revision")
    def revision(id: int, payload: dict = Depends(solo_coordinador)):
        try:
            return solicitud_to_dict(solicitud_use_cases.poner_en_revision(id))
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

    return router
