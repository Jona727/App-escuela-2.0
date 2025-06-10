from fastapi import APIRouter
from models.modelo import Career, inputCareer, session

career = APIRouter()

@career.get("/career/all")
def get_careers():
    return session.query(Career).all()

@career.post("/career/add")
def add_career(ca: inputCareer):
    try:
        newCareer = Career(name=ca.name) 
        session.add(newCareer)
        session.commit()
        res = f"Carrera {ca.name} guardada correctamente"  
        print(res)
        return res
    except Exception as ex:
        session.rollback()
        print("error al agregar career", ex)
        return {"error": str(ex)} 
    finally:
        session.close()
