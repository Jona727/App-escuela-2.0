from fastapi import APIRouter, HTTPException
from models.modelo import Career, inputCareer, session
from fastapi.responses import JSONResponse

career = APIRouter()

@career.get("/careers/all")
def get_all_careers():
    try:
        carreras = session.query(Career).all()
        result = []
        for c in carreras:
            result.append({
                "id": c.id,
                "name": c.name,
            })
        return JSONResponse(content=result)
    except Exception as e:
        print(f"Error al obtener carreras: {e}")
        session.rollback()
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

# Crear nueva carrera
@career.post("/careers/add")
def create_career(data: inputCareer):
    try:
        new_career = Career(name=data.name) # <-- ¡ASÍ DEBE QUEDAR!
        session.add(new_career)
        session.commit()
        return {"status": "success", "message": "Carrera creada correctamente", "id": new_career.id}
    except Exception as e:
        session.rollback()
        print("Error al crear carrera:", e) # Esto ahora debería mostrar 'inputCareer' object has no attribute 'description'
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

# Editar una carrera
@career.put("/careers/{career_id}")
def update_career(career_id: int, data: inputCareer):
    try:
        carrera = session.query(Career).filter(Career.id == career_id).first()
        if not carrera:
            raise HTTPException(status_code=404, detail="Carrera no encontrada")

        carrera.name = data.name
        # carrera.description = data.description # <-- ¡BORRÁ ESTA LÍNEA!
        session.commit()
        return {"status": "success", "message": "Carrera actualizada correctamente"}
    except Exception as e:
        session.rollback()
        print("Error al actualizar carrera:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()

# Eliminar una carrera
@career.delete("/careers/{career_id}")
def delete_career(career_id: int):
    try:
        carrera = session.query(Career).filter(Career.id == career_id).first()
        if not carrera:
            raise HTTPException(status_code=404, detail="Carrera no encontrada")
        
        session.delete(carrera)
        session.commit()
        return {"status": "success", "message": "Carrera eliminada correctamente"}
    except Exception as e:
        session.rollback()
        print("Error al eliminar carrera:", e)
        raise HTTPException(status_code=500, detail="Error interno")
    finally:
        session.close()