from fastapi import APIRouter, HTTPException
from models.modelo import InputCurso, Curso, session, User, Career  
from fastapi.responses import JSONResponse

curso = APIRouter()

@curso.post("/curso/AddCurso")
def agregar_curso(curso_data: InputCurso):
    try:
        nuevo_curso = Curso(
            name=curso_data.name,
            status=curso_data.status

        )

        session.add(nuevo_curso)
        session.commit()
        session.refresh(nuevo_curso) 

        return JSONResponse(status_code=201, content={
            "detail": "Curso agregado correctamente",
            "curso_id": nuevo_curso.id,
            "curso_name": nuevo_curso.name
        })
    except Exception as e:
        session.rollback()
        print(f"Error al agregar curso: {e}")
        return JSONResponse(status_code=500, content={"detail": f"Error al agregar curso: {e}"})
    finally:
        session.close()


@curso.get("/cursos/all")
def get_all_cursos():
    try:
        cursos = session.query(Curso).all()
        result = []
        for c in cursos:
            result.append({
                "id": c.id,
                "name": c.name,
                "status": c.status,
                "user_id": c.user_id,
                "career_id": c.career_id
            })
        return JSONResponse(content=result)
    except Exception as e:
        print("Error al obtener cursos:", e)
        session.rollback()
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

@curso.put("/curso/update/{curso_id}")
def update_curso(curso_id: int, data: InputCurso):
    try:
        curso_existente = session.query(Curso).filter(Curso.id == curso_id).first()
        if not curso_existente:
            raise HTTPException(status_code=404, detail="Curso no encontrado")

        curso_existente.name = data.name
        curso_existente.status = data.status

        session.commit()
        return {"status": "success", "message": "Curso actualizado correctamente"}
    except Exception as e:
        session.rollback()
        print("Error al actualizar curso:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

@curso.delete("/curso/delete/{curso_id}")
def delete_curso(curso_id: int):
    try:
        curso = session.query(Curso).filter(Curso.id == curso_id).first()
        if not curso:
            raise HTTPException(status_code=404, detail="Curso no encontrado")

        session.delete(curso)
        session.commit()
        return {"status": "success", "message": "Curso eliminado correctamente"}
    except Exception as e:
        session.rollback()
        print("Error al eliminar curso:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()
    






