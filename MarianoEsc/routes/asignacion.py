from fastapi import APIRouter, HTTPException
from models.modelo import session, AsignacionCursoCareer, Career, Curso
from fastapi.responses import JSONResponse
from models.modelo import InputAsignacion

asignacion = APIRouter()

@asignacion.post("/asignaciones/")
def asignar_career_a_curso(data: InputAsignacion):
    try:
        nueva = AsignacionCursoCareer(career_id=data.career_id, curso_id=data.curso_id)
        session.add(nueva)
        session.commit()
        return {"status": "success", "message": "Career asignada al curso correctamente"}
    except Exception as e:
        session.rollback()
        print("Error al asignar career:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

@asignacion.get("/cursos/{curso_id}/careers")
def listar_careers_de_curso(curso_id: int):
    try:
        asignaciones = session.query(AsignacionCursoCareer).filter_by(curso_id=curso_id).all()
        result = [{
            "career_id": a.career.id,
            "career_name": a.career.name
        } for a in asignaciones]
        return result
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error interno")

@asignacion.delete("/asignaciones/{asignacion_id}")
def eliminar_asignacion(asignacion_id: int):
    try:
        asignacion = session.query(AsignacionCursoCareer).filter_by(id=asignacion_id).first()
        if not asignacion:
            raise HTTPException(status_code=404, detail="Asignación no encontrada")
        session.delete(asignacion)
        session.commit()
        return {"message": "Asignación eliminada correctamente"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail="Error interno")
    
@asignacion.get("/asignaciones/all")
def obtener_todas_las_asignaciones():
    try:
        asignaciones = session.query(AsignacionCursoCareer).all()
        resultado = [
            {
                "id": a.id,
                "curso_id": a.curso.id,
                "curso_nombre": a.curso.name,
                "carrera_id": a.career.id,
                "carrera_nombre": a.career.name,
            }
            for a in asignaciones
        ]
        return resultado
    except Exception as e:
        session.rollback()
        print("Error al obtener asignaciones:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()
