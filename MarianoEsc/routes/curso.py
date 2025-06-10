from fastapi import APIRouter, HTTPException
from models.modelo import InputCurso, Curso, session, User, Career  
from fastapi.responses import JSONResponse

curso = APIRouter()

@curso.post("/curso/AddCurso")
def agregar_curso(curso_data: InputCurso):
    try:
        user = session.query(User).filter(User.id == curso_data.user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"detail": "Usuario no encontrado"})

        career = session.query(Career).filter(Career.name == curso_data.career_name).first()
        if not career:
            career = Career(name=curso_data.career_name)
            session.add(career)
            session.commit()
            session.refresh(career)

        nuevo_curso = Curso(
            name=curso_data.name,
            status=curso_data.status,
            user_id=curso_data.user_id,
            career_id=career.id
        )

        session.add(nuevo_curso)
        session.commit()

        return JSONResponse(status_code=201, content={"detail": "Curso agregado correctamente"})
    except Exception as e:
        session.rollback()
        print("Error al agregar curso:", e)
        return JSONResponse(status_code=500, content={"detail": "Error al agregar curso"})
    finally:
        session.close()
        

@curso.get("/careers/{user_id}")
def get_carrera(user_id: int):
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        cursos = session.query(Curso).filter(Curso.user_id == user_id).all()

        result = []
        for c in cursos:
            result.append({
                "name": c.name,
                "status": c.status
            })

        return JSONResponse(content=result)
    
    except Exception as e:
        print("Error en get_carrera:", e)
        session.rollback()  
        raise HTTPException(status_code=500, detail="Error interno del servidor")

    finally:
        session.close()

