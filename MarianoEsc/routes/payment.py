from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.modelo import Payment, inputPayment, User, session

payment = APIRouter()

@payment.get("/payment/all/detailled")
def get_payments():
    paymentsDetailled = []
    allPayments =  session.query(Payment).all()
    for pay in allPayments:
        result = {
            "id_pago" : pay.id,
            "monto": pay.amount,
            "afecha de pago" : pay.created_at,
            "mes_pagado" : pay.affected_month,
            "alumno": f"{pay.user.userdetail.first_name} {pay.user.userdetail.last_name}",
            "carrera afectada": pay.career.name
        }
        paymentsDetailled.append(result)
    return paymentsDetailled
    ##return session.query(Payment).options(joinedload(Payment.user)).userdetail

@payment.get("/payment/user/{_username}")
def payament_user(_username: str):
    try:
        userEncontrado = session.query(User).filter(User.username == _username ).first()
        arraySalida = []
        if(userEncontrado):
            payments = userEncontrado.payments
            for pay in payments:
                payment_detail = {
                    "id": pay.id,
                    "amount": pay.amount,
                    "fecha_pago": pay.created_at,
                    "usuario": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                    "carrera": pay.career.name,
                    "mes_afectado":pay.affected_month
                }
                arraySalida.append(payment_detail)
            return arraySalida
        else:
            return "Usuario no encontrado!"
    except Exception as ex:
        session.rollback()
        print("Error al traer usuario y/o pagos")
    finally:
        session.close()

@payment.post("/payment/add")
def add_payment(pay:inputPayment):
    try:
        newPayment = Payment(pay.career_id, pay.user_id, pay.amount, pay.affect_month)
        session.add(newPayment)
        session.commit()
        res = f"Pago para el alumno {newPayment.user.userdetail.firstName} {newPayment.user.userdetail.lastName}, guardado"
        print(res)
        return res
    except Exception as ex:
        print("Error a guardar pago", ex)
    finally:
        session.close()