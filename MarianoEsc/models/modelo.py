from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr, Field
from config.db import engine, Base
from typing import Optional, Dict, Any
from enum import Enum
import datetime

# ------------------------
# MODELOS SQLALCHEMY
# ------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String)
    email = Column(String(80), nullable=False, unique=True)

    userdetail = relationship("UserDetail", uselist=False)
    payments = relationship("Payment", back_populates="user")
    pivote_user_cursos = relationship("PivoteUserCurso", back_populates="user")

    def __init__(self, username, password, email):
        self.username = username
        self.password = password
        self.email = email


class UserDetail(Base):
    __tablename__ = "user_details"

    id = Column(Integer, primary_key=True)
    dni = Column(Integer, unique=True)
    firstName = Column(String(50))
    lastName = Column(String(30))
    type = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="userdetail")

    def __init__(self, dni, firstName, lastName, type, user_id):
        self.dni = dni
        self.firstName = firstName
        self.lastName = lastName
        self.type = type
        self.user_id = user_id


class Curso(Base):
    __tablename__ = "cursos"

    id = Column(Integer, primary_key=True)
    name = Column(String(50))
    status = Column(String(50))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=True)

    payments = relationship("Payment", back_populates="curso")
    pivote_user_cursos = relationship("PivoteUserCurso", back_populates="curso")
    asignaciones = relationship("AsignacionCursoCareer", back_populates="curso")



class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    asignaciones = relationship("AsignacionCursoCareer", back_populates="career")


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    curso_id = Column(ForeignKey("cursos.id"))
    user_id = Column(ForeignKey("users.id"))
    amount = Column(Integer)
    affect_month = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.now)

    user = relationship("User", back_populates="payments")
    curso = relationship("Curso", back_populates="payments")

    def __init__(self, curso_id, user_id, amount, affect_month):
        self.curso_id = curso_id
        self.user_id = user_id
        self.amount = amount
        self.affect_month = affect_month


class PivoteUserCurso(Base):
    __tablename__ = "pivote_user_curso"

    id = Column(Integer, primary_key=True)
    id_curso = Column(ForeignKey("cursos.id"))
    id_user = Column(ForeignKey("users.id"))

    user = relationship("User", back_populates="pivote_user_cursos")
    curso = relationship("Curso", back_populates="pivote_user_cursos")  # ← esta es la correcta

    def __init__(self, id_user, id_curso):
        self.id_user = id_user
        self.id_curso = id_curso


class AsignacionCursoCareer(Base):
    __tablename__ = "asignaciones"

    id = Column(Integer, primary_key=True)
    career_id = Column(ForeignKey("careers.id"), nullable=False)
    curso_id = Column(ForeignKey("cursos.id"), nullable=False)

    career = relationship("Career", back_populates="asignaciones")
    curso = relationship("Curso", back_populates="asignaciones")

# ------------------------
# MODELOS Pydantic
# ------------------------

class InputUser(BaseModel):
    username: str
    password: str
    email: EmailStr
    dni: int
    firstname: str
    lastname: str
    type: str

class InputLogin(BaseModel):
    username: str
    password: str

class UserType(str, Enum):
    admin = "Administrador"
    student = "Alumno"

class SignupUser(BaseModel):
    username: str
    password: str
    email: EmailStr
    dni: int
    firstname: str
    lastname: str
    type: UserType

class InputUserDetails(BaseModel):
    dni: int
    firstName: str
    lastName: str
    type: str
    email: EmailStr

class InputCurso(BaseModel):
    name: str
    status: str

class OutputCurso(BaseModel):
    name: str
    status: str

class inputCareer(BaseModel):
    name: str

class inputPayment(BaseModel):
    curso_id: int
    user_id: int
    amount: int
    affect_month: str

class InputUserAddCurso(BaseModel):
    id_user: int
    id_curso: int

class ChangePasswordInput(BaseModel):
    current_password: str
    new_password: str

class InputAsignacion(BaseModel):
    career_id: int
    curso_id: int

class InputPaginatedRequest(BaseModel):
    limit: int = 20
    last_seen_id: Optional[int] = None
    search: Optional[str] = ""


class InputPaginatedRequestFilter(BaseModel):
    limit: int = Field(
        20, gt=0, le=100, description="Cantidad máxima de registros a retornar"
    )
    last_seen_id: Optional[int] = Field(
        None, description="ID del último registro visto (cursor) para keyset pagination"
    )
    filters: Optional[Dict[str, Any]] = Field(
        None, description="Filtros opcionales de búsqueda"
    )

# ------------------------
# CONFIGURACIÓN BASE DE DATOS
# ------------------------

Base.metadata.create_all(bind=engine)
Session = sessionmaker(bind=engine)
session = Session()