from re import search
from fastapi import APIRouter, Request, HTTPException, Query
from sentry_sdk import last_event_id
from sqlalchemy import or_, String
from sympy import limit
from models.modelo import InputLogin, Curso, InputUserAddCurso , session, Session, SignupUser, User, UserDetail, ChangePasswordInput, PivoteUserCurso, InputPaginatedRequest
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from .auth.security import Security
from typing import Optional

user = APIRouter()


@user.get("/")
def welcome():
   return "Bienvenido!!"


@user.get("/users/all")
def obtener_usuarios(   
   req: Request,
   limit: int = Query(20, gt=0, le=100),
   last_seen_id: Optional[int] = Query(None),
):
    try:
        has_access = Security.verify_token(req.headers)
        if "iat" in has_access:
            query = (
                session.query(User)
                .options(joinedload(User.userdetail))
                .order_by(User.id)
            )

            if last_seen_id is not None:
                query = query.filter(User.id > last_seen_id)

            usuarios = query.limit(limit).all()

            usuarios_con_detalles = []
            for usuario in usuarios:
                if usuario.userdetail:
                    # Obtener curso del usuario si existe
                    curso_name = None
                    if usuario.pivote_user_cursos:
                        curso_name = usuario.pivote_user_cursos[0].curso.name if usuario.pivote_user_cursos[0].curso else None

                    usuario_con_detalle = {
                        "id": usuario.id,
                        "username": usuario.username,
                        "email": usuario.email,
                        "dni": usuario.userdetail.dni,
                        "firstname": usuario.userdetail.firstName,
                        "lastname": usuario.userdetail.lastName,
                        "type": usuario.userdetail.type,
                        "curso": curso_name,
                    }
                    usuarios_con_detalles.append(usuario_con_detalle)

            next_cursor = (
                usuarios_con_detalles[-1]["id"]
                if len(usuarios_con_detalles) == limit
                else None
            )

            return JSONResponse(
                status_code=200, 
                content={"users": usuarios_con_detalles, "next_cursor": next_cursor}
            )
        else:
            return JSONResponse(
                status_code=401,
                content=has_access
            )
    except Exception as e:
        print("Error al obtener usuarios:", e)
        return JSONResponse(
            status_code=500, content={"detail": "Error al obtener usuarios"}
        )

@user.post("/users/paginated/filtered-async")
async def get_users_paginated_filtered_async(req: Request, body: InputPaginatedRequest):
    db = Session()
    try:
        # Verificar token
        has_access = Security.verify_token(req.headers)
        if "iat" not in has_access:
            return JSONResponse(status_code=401, content=has_access)

        limit = body.limit if body.limit else 20
        last_seen_id = body.last_seen_id
        search_text = (getattr(body, "search", "") or "").strip()
        dni_filter = getattr(body, "dni", None)
        curso_filter = (getattr(body, "curso", "") or "").strip()

        # Query base
        query = (
            db.query(User)
            .join(User.userdetail)                        # join para filtrar sobre UserDetail
            .options(joinedload(User.userdetail))        # mantener eager load del detalle
            .order_by(User.id)
        )

        if last_seen_id is not None:
            query = query.filter(User.id > last_seen_id)

        # Filtrado por DNI (búsqueda exacta o parcial)
        if dni_filter is not None:
            dni_str = str(dni_filter)
            query = query.filter(UserDetail.dni.cast(String).like(f"%{dni_str}%"))

        # Filtrado por curso
        if curso_filter:
            query = query.join(User.pivote_user_cursos).join(PivoteUserCurso.curso).filter(
                Curso.name.ilike(f"%{curso_filter}%")
            )

        # Filtrado por texto (si viene)
        if search_text:
            pattern = f"%{search_text}%"
            query = query.filter(
                or_(
                    # Ajustá los nombres de campo según tu modelo (firstName / lastName o first_name / last_name)
                    UserDetail.firstName.ilike(pattern),
                    UserDetail.lastName.ilike(pattern),
                    User.username.ilike(pattern),
                    User.email.ilike(pattern),
                )
            )

        users = query.limit(limit).all()

        usuarios_con_detalles = []
        for u in users:
            # Asegurate de que userdetail exista y de los nombres de atributos
            detail = u.userdetail

            # Obtener curso del usuario si existe
            curso_name = None
            if u.pivote_user_cursos:
                curso_name = u.pivote_user_cursos[0].curso.name if u.pivote_user_cursos[0].curso else None

            usuarios_con_detalles.append({
                "id": u.id,
                "username": u.username,
                "email": u.email if getattr(u, "email", None) is not None else None,
                # Si tus attrs son first_name/last_name, reemplaza por esos
                "firstname": detail.firstName if detail else None,
                "lastname": detail.lastName if detail else None,
                "dni": detail.dni if detail else None,
                "type": detail.type if detail else None,
                "curso": curso_name,
            })

        next_cursor = usuarios_con_detalles[-1]["id"] if len(usuarios_con_detalles) == limit else None

        return JSONResponse(status_code=200, content={"users": usuarios_con_detalles, "next_cursor": next_cursor})

    except Exception as e:
        db.rollback()
        print("Error en users/paginated/filtered-async:", e) 
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Error al obtener usuarios paginados filtrados"})
    finally:
        db.close()
    
   
@user.post("/users/signup")
def signup_user(us: SignupUser):
    try:
        # VERIFICA
        existing_user = session.query(User).filter(
            (User.username == us.username) | (User.email == us.email)
        ).first()
        if existing_user:
            return JSONResponse(status_code=400, content={"status": "error", "message": "El username o email ya existe"})

        # Crear el USUARIO
        new_user = User(username=us.username, password=us.password, email=us.email)
        session.add(new_user)
        session.commit()

        # Crea UserDetail.
        new_user_detail = UserDetail(
            dni=us.dni,
            firstName=us.firstname,
            lastName=us.lastname,
            type=us.type, 
            user_id=new_user.id
        )
        session.add(new_user_detail)
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
        user = session.query(User).filter(User.username == us.username).first()
        if user and user.password == us.password:
            tkn = Security.generate_token(user)
            if not tkn:
                return {"message":"Error en la generación del token!"}
            else:
                res = {
                    "status": "success",
                    "token": tkn,
                    "user": user.userdetail,
                    "message":"User logged in successfully!"
                }
                print(res)
                return res
        else:
            res={"message": "Invalid username or password"}
            print(res)
            return res
    except Exception as ex:
        print(f"Error ---->>> {ex}")
    finally:
        session.close()

## Inscribir un alumno a un curso
@user.post("/user/addcurso")
def addCurso(req: Request, ins: InputUserAddCurso):
    session = Session()
    try:
        # Validar token del usuario
        token_data = Security.verify_token(req.headers)
        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        # Verificar si ya está inscripto
        existe = session.query(PivoteUserCurso).filter_by(
            id_user=ins.id_user,
            id_curso=ins.id_curso
        ).first()

        if existe:
            return JSONResponse(status_code=400, content={"detail": "El alumno ya está inscripto en ese curso"})

        # Crear inscripción
        nueva_inscripcion = PivoteUserCurso(ins.id_user, ins.id_curso)
        session.add(nueva_inscripcion)
        session.commit()

        # Obtener nombre para el mensaje
        nombre = f"{nueva_inscripcion.user.userdetail.firstName} {nueva_inscripcion.user.userdetail.lastName}"
        curso = nueva_inscripcion.curso.name

        return f"{nombre} fue inscripto correctamente al curso {curso}"

    except Exception as e:
        session.rollback()
        print("Error:", e)
        import traceback
        traceback.print_exc()
        return JSONResponse(status_code=500, content={"detail": "Error interno al inscribir alumno"})

    finally:
        session.close()

@user.delete("/users/{user_id}")
def eliminar_usuario(user_id: int, req: Request):
    try:
        # Verificamos el token
        token_data = Security.verify_token(req.headers)
        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Usuario no encontrado"})

        # Eliminar detalles asociados
        user_detail = session.query(UserDetail).filter(UserDetail.user_id == user.id).first()
        if user_detail:
            session.delete(user_detail)

        session.delete(user)
        session.commit()

        return {"status": "success", "message": "Usuario eliminado correctamente"}

    except Exception as e:
        session.rollback()
        print("Error al eliminar usuario:", e)
        return JSONResponse(status_code=500, content={"status": "error", "message": "Error interno del servidor"})

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

@user.get("/users/profile/{user_id}")
def get_user_profile(user_id: int):
    user = session.query(User).filter(User.id == user_id).first()
    if not user:
        return JSONResponse(status_code=404, content={"status": "error", "message": "Usuario no encontrado"})

    user_detail = session.query(UserDetail).filter(UserDetail.user_id == user.id).first()

    return {
        "status": "success",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "firstname": user_detail.firstName,
            "lastname": user_detail.lastName,
            "dni": user_detail.dni,
            "type": user_detail.type
        }
    }

@user.put("/users/profile/{user_id}")
def update_user_profile(user_id: int, profile: SignupUser):  # o un nuevo modelo para editar
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Usuario no encontrado"})

        user.email = profile.email

        user_detail = session.query(UserDetail).filter(UserDetail.user_id == user.id).first()
        user_detail.firstName = profile.firstname
        user_detail.lastName = profile.lastname
        user_detail.dni = profile.dni

        session.commit()

        return {"status": "success", "message": "Perfil actualizado correctamente"}

    except Exception as ex:
        session.rollback()
        return JSONResponse(status_code=500, content={"status": "error", "message": "Error interno"})

    finally:
        session.close()

@user.put("/users/change-password")
def change_password(req: Request, data: ChangePasswordInput):
    try:
        # Validamos token
        token_data = Security.verify_token(req.headers)

        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        user_id = token_data.get("id")
        if not user_id:
            return JSONResponse(status_code=400, content={"status": "error", "message": "Token inválido: sin ID"})

        user = session.query(User).filter(User.id == user_id).first()

        if not user:
            return JSONResponse(status_code=404, content={"status": "error", "message": "Usuario no encontrado"})

        if user.password != data.current_password:
            return JSONResponse(status_code=400, content={"status": "error", "message": "Contraseña actual incorrecta"})

        # Actualiza la contraseña
        user.password = data.new_password
        session.commit()

        return {"status": "success", "message": "Contraseña actualizada correctamente"}

    except Exception as ex:
        session.rollback()
        print(f"Error al cambiar contraseña: {ex}")
        return JSONResponse(status_code=500, content={"status": "error", "message": "Error interno del servidor"})

    finally:
        session.close()
    
@user.get("/user/mis-pagos")
def get_my_payments(req: Request):
    try:
        token_data = Security.verify_token(req.headers)
        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        user_id = token_data.get("id")
        user = session.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        pagos = []
        for p in user.payments:
            pagos.append({
                "monto": p.amount,
                "fecha_pago": p.created_at,
                "mes_pagado": p.affected_month,
                "carrera": p.career.name
            })

        return pagos
    except Exception as e:
        session.rollback()
        print("Error al obtener pagos:", e)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        session.close()

@user.get("/user/mis-cursos")
def get_my_courses(req: Request):
    try:
        token_data = Security.verify_token(req.headers)
        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        user_id = token_data.get("id")
        user = session.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        cursos = []
        for c in user.cursos:  # Asegurate que haya relación `User.cursos = relationship("Curso", ...)`
            cursos.append({
                "nombre": c.name,
                "estado": c.status,
                "carrera": c.career.name if c.career else None
            })

        return cursos
    except Exception as e:
        session.rollback()
        print("Error al obtener cursos:", e)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        session.close()
    
@user.get("/users/{user_id}/cursos") 
def get_cursos_by_user(user_id: int):
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
        print("Error en get_cursos_by_user:", e)
        session.rollback()
        raise HTTPException(status_code=500, detail="Error interno del servidor")

    finally:
        session.close()

@user.get("/user/mi-cursada")
def get_mi_cursada(req: Request):
    try:
        # Validar token JWT
        token_data = Security.verify_token(req.headers)
        if token_data.get("status") == "error":
            return JSONResponse(status_code=401, content=token_data)

        user_id = token_data.get("id")
        if not user_id:
            return JSONResponse(
                status_code=400,
                content={"status": "error", "message": "Token sin ID de usuario"}
            )

        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return JSONResponse(
                status_code=404,
                content={"status": "error", "message": "Usuario no encontrado"}
            )

        # Obtener inscripción a curso
        curso_inscripto = session.query(PivoteUserCurso).filter_by(id_user=user_id).first()
        if not curso_inscripto:
            return JSONResponse(
                status_code=404,
                content={"status": "error", "message": "El usuario no tiene un curso asignado"}
            )

        curso = curso_inscripto.curso
        if not curso:
            return JSONResponse(
                status_code=404,
                content={"status": "error", "message": "Curso no encontrado en la base de datos"}
            )

        # Obtener materias (careers) asignadas a ese curso
        materias = []
        if curso.asignaciones:
            for asignacion in curso.asignaciones:
                materias.append({
                    "id": asignacion.career.id,
                    "nombre": asignacion.career.name,
                    "estado": "Cursando"
                })

        return {
            "curso": {
                "id": curso.id,
                "nombre": curso.name,
                "status": curso.status,
                "anio_escolar": 2025
            },
            "materias": materias
        }

    except Exception as e:
        session.rollback()
        print("Error al obtener Mi Cursada:", e)
        raise HTTPException(status_code=500, detail="Error interno del servidor")

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
   