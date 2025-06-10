from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel, EmailStr
from config.db import engine, Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    password = Column(String)
    email = Column(String(80), nullable=False, unique=True)

    userdetail = relationship("UserDetail", uselist=False)
    cursos = relationship("Curso", back_populates="user")
    payments = relationship("Payment", back_populates="user")
    pivoteusercareer = relationship("PivoteUserCareer", back_populates="user")

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

    id = Column (Integer, primary_key=True)
    name = Column (String(50))
    status = Column (String(50))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    career_id = Column(Integer, ForeignKey("careers.id"), nullable=True)

    user = relationship("User", back_populates="cursos")
    career = relationship("Career", back_populates="cursos")

class Career(Base):
    __tablename__ = "careers"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)

    cursos = relationship("Curso", back_populates="career")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)
    career_id = Column(ForeignKey("careers.id"))
    user_id = Column(ForeignKey("users.id"))
    amount = Column(Integer)
    affect_month = Column(DateTime)
    created_at = Column(DateTime, default=datetime.datetime.now)

    user = relationship("User", uselist=False, back_populates="payments")
    career = relationship("Career", uselist=False)


    def __init__(self, career_id, user_id, amount, affect_month):
        self.career_id = career_id
        self.user_id = user_id
        self.amount = amount
        self.affect_month = affect_month

class PivoteUserCareer(Base):
    __tablename__ = "pivote_user_career"
    id = Column(Integer, primary_key=True)
    id_career = Column(ForeignKey("careers.id"))
    id_user = Column(ForeignKey("users.id"))

    user = relationship("User", uselist=False, back_populates="pivoteusercareer")
    career = relationship("Career", uselist=False)

    def __init__(self, id_user, id_career):
        self.id_user = id_user
        self.id_career = id_career


# Modelos de Pydantic para validación de datos
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

class InputUserDetails(BaseModel):
    dni: int
    firstName: str
    lastName: str
    type: str
    email: EmailStr

class InputCurso(BaseModel):
    name: str
    status: str
    user_id: int
    career_name: str  

class OutputCurso(BaseModel):
    name: str
    status: str

class inputCareer(BaseModel):
    name : str

class inputPayment(BaseModel):
    career_id: int
    user_id: int
    amount: int
    affect_month: datetime.date

class InputUserAddCareer(BaseModel):
    id_user: int
    id_career: int
    
# region Configuraciones

# Crear las tablas definidas por los modelos en la base de datos
Base.metadata.create_all(bind=engine)

# Crear la clase de sesión
Session = sessionmaker(bind=engine)  # Clase de sesión para interactuar con la DB

# Instanciar una sesión (conexión a la base de datos)
session = Session()
# endregion