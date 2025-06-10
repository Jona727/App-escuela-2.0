from fastapi import APIRouter
from models.modelo import InputLogin, session, InputUser, User, UserDetail, InputUserAddCareer, PivoteUserCareer
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

user = APIRouter()


@user.get("/")
def welcome():
   return "Bienvenido!!"


@user.get("/users/all")
def obtener_usuarios():
   try:

       usuarios = session.query(User).options(joinedload(User.userdetail)).all()

       usuarios_con_detalles = []
       for usuario in usuarios:
           if usuario.userdetail:
               usuario_con_detalle = {
                   "id": usuario.id,
                   "username": usuario.username,
                   "email": usuario.email,
                   "dni": usuario.userdetail.dni,
                   "firstname": usuario.userdetail.firstName,
                   "lastname": usuario.userdetail.lastName,  
                   "type": usuario.userdetail.type,
               }
               usuarios_con_detalles.append(usuario_con_detalle)

       return JSONResponse(status_code=200, content=usuarios_con_detalles)
   except Exception as e:
       print("Error al obtener usuarios:", e)
       return JSONResponse(
           status_code=500, content={"detail": "Error al obtener usuarios"}
       )


@user.get("/users/{pepito}")
def obtenerUser(pepito: int):
    return session.query(User).filter(User.id == pepito).first()
   
'''
@user.post("/users/add")
def crear_usuario(user_data: InputUser):
    try:

        existing_user = session.query(User).filter(User.username == user_data.username).first()
        if existing_user:
            return JSONResponse(status_code=400, content={"detail": "El username ya existe"})
        
        existing_email = session.query(User).filter(User.email == user_data.email).first()
        if existing_email:
            return JSONResponse(status_code=400, content={"detail": "El email ya existe"})

        existing_dni = session.query(UserDetail).filter(UserDetail.dni == user_data.dni).first()
        if existing_dni:
            return JSONResponse(status_code=400, content={"detail": "El DNI ya existe"})

        new_user = User(user_data.username, user_data.password, user_data.email)
        session.add(new_user)
        session.flush()

        new_detail = UserDetail(
            dni=user_data.dni,
            firstName=user_data.firstname,
            lastName=user_data.lastname,
            type=user_data.type,
            user_id=new_user.id
        )
        session.add(new_detail)

        session.commit()
        return JSONResponse(status_code=201, content={"detail": "Usuario creado correctamente"})

    except IntegrityError as e:
        session.rollback()
        print("Error de integridad:", e)
        return JSONResponse(status_code=400, content={"detail": "Error de integridad. Revisa los datos únicos"})

    except Exception as e:
        session.rollback()
        print("Error inesperado:", e)
        return JSONResponse(status_code=500, content={"detail": "Error inesperado al crear el usuario"})

    finally:
        session.close()
'''
@user.post("/users/signup")
def signup_user(us: InputLogin):  # Reutilizás el mismo esquema que el login
    try:
        existing_user = session.query(User).filter(User.username == us.username).first()
        if existing_user:
            return JSONResponse(status_code=400, content={"status": "error", "message": "El username ya existe"})

        new_user = User(username=us.username, password=us.password, email=None)  # email opcional
        session.add(new_user)
        session.commit()

        return {
            "status": "success",
            "user": {
                "id": new_user.id,
                "username": new_user.username
            },
            "message": "Usuario creado correctamente"
        }

    except Exception as ex:
        print("Error -->", ex)
        session.rollback()
        return JSONResponse(status_code=500, content={"status": "error", "message": "Error interno del servidor"})

    finally:
        session.close()


@user.post("/users/loginUser")
def login_user(us: InputLogin):
    try:
        res = session.query(User).filter(User.username == us.username).first()

        if res and res.password == us.password:
            return {
                "status": "success",
                "token": "qweklrjknqwrlkjqwnrelkqwmnerlkjqwnekrljqwen",  # token simulado
                "user": res.userdetail,  # Podés ajustar esto según tus modelos
                "message": "User logged in successfully"
            }
        else:
            return {
                "message": "Invalid username or password"
            }
    except Exception as ex:
        print("Error --> ", ex)
    finally:
        session.close()

## Inscribir un alumno a una carrera      
@user.post("/user/addcareer")
def addCareer(ins: InputUserAddCareer):
    try: 
        newInsc = PivoteUserCareer(ins.id_user, ins.id_career)
        session.add(newInsc)
        session.commit()
        res = f"{newInsc.user.userdetail.firstName} {newInsc.user.userdetail.lastName} fue inscripto correctamente a {newInsc.career.name}"
        print(res)
        return res
    except Exception as ex:
        session.rollback()
        print("Error al inscribir al alumno:", ex)
        import traceback
        traceback.print_exc()    
    finally:
        session.close()

@user.get("/user/career/{_username}")
def get_career_user(_username: str):
    try:
        userEncontrado = session.query(User).filter(User.username == _username ).first()
        arraySalida = []
        if(userEncontrado):
            pivoteusercareer = userEncontrado.pivoteusercareer
            for pivote in pivoteusercareer:
                career_detail = {
                    "usuario": f"{pivote.user.userdetail.firstName} {pivote.user.userdetail.lastName}",
                    "carrera": pivote.career.name,
                }
                arraySalida.append(career_detail)
            return arraySalida
        else:
            return "Usuario no encontrado!"
    except Exception as ex:
        session.rollback()
        print("Error al traer usuario y/o pagos")
    finally:
        session.close()

    
def validate_username(value):
   existing_user = session.query(User).filter(User.username == value).first()
   session.close()
   if existing_user:
       return None
   else:
       return value


def validate_email(value):
   existing_email = session.query(User).filter(User.email == value).first()
   session.close()
   if existing_email:
       return None
   else:
       return value