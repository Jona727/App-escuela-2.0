from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from models.modelo import Payment, inputPayment, User, session
from sqlalchemy.orm import joinedload
from typing import Optional
from datetime import datetime


payment = APIRouter()

@payment.get("/payment/all/detailled")
def get_payments():
    paymentsDetailled = []
    allPayments = session.query(Payment).all()
    for pay in allPayments:
        result = {
            "id_pago": pay.id,
            "monto": pay.amount,
            "fecha_de_pago": pay.created_at,
            "mes_pagado": pay.affect_month,
            "alumno": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
            "curso_afectado": pay.curso.name
        }
        paymentsDetailled.append(result)
    return paymentsDetailled

@payment.get("/payment/paginated")
def get_payments_paginated(
    user_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    limit: int = Query(20, gt=0, le=100),
    last_seen_id: Optional[int] = Query(None),
):
    try:
        query = session.query(Payment).order_by(Payment.id)

        if user_id is not None:
            query = query.filter(Payment.user_id == user_id)

        if start_date is not None:
            query = query.filter(Payment.created_at >= start_date)

        if end_date is not None:
            query = query.filter(Payment.created_at <= end_date)

        if last_seen_id is not None:
            query = query.filter(Payment.id > last_seen_id)

        pagos = query.limit(limit).all()

        paymentsDetailled = []
        for pay in pagos:
            result = {
                "id_pago": pay.id,
                "monto": pay.amount,
                "fecha_de_pago": pay.created_at,
                "mes_pagado": pay.affect_month,
                "alumno": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                "curso_afectado": pay.curso.name,
            }
            paymentsDetailled.append(result)

        next_cursor = paymentsDetailled[-1]["id_pago"] if len(paymentsDetailled) == limit else None

        return {
            "payments": paymentsDetailled,
            "next_cursor": next_cursor
        }

    except Exception as e:
        print("Error al obtener pagos:", e)
        return JSONResponse(
            status_code=500, content={"detail": "Error al obtener pagos"}
        )

@payment.get("/payment/user/{_username}")
def payament_user(_username: str):
    try:
        userEncontrado = session.query(User).filter(User.username == _username).first()
        arraySalida = []
        if userEncontrado:
            payments = userEncontrado.payments
            for pay in payments:
                payment_detail = {
                    "id": pay.id,
                    "amount": pay.amount,
                    "fecha_pago": pay.created_at,
                    "usuario": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                    "curso": pay.curso.name,
                    "mes_afectado": pay.affect_month
                }
                arraySalida.append(payment_detail)
            return arraySalida
        else:
            return {"error": "Usuario no encontrado"}
    except Exception as ex:
        session.rollback()
        print("Error al traer usuario y/o pagos:", ex)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        session.close()

@payment.post("/payment/add")
def add_payment(pay: inputPayment):
    try:
        newPayment = Payment(
            curso_id=pay.curso_id,
            user_id=pay.user_id,
            amount=pay.amount,
            affect_month=pay.affect_month
        )
        session.add(newPayment)
        session.commit()
        res = f"Pago para el alumno {newPayment.user.userdetail.firstName} {newPayment.user.userdetail.lastName}, guardado"
        return {"status": "success", "message": res}
    except Exception as ex:
        session.rollback()
        print("Error al guardar pago:", ex)
        raise HTTPException(status_code=500, detail=f"Error al guardar pago: {str(ex)}")
    finally:
        session.close()

@payment.delete("/payment/delete/{payment_id}")
def delete_payment(payment_id: int):
    try:
        pago = session.query(Payment).filter(Payment.id == payment_id).first()
        if not pago:
            raise HTTPException(status_code=404, detail="Pago no encontrado")

        session.delete(pago)
        session.commit()
        return {"status": "success", "message": "Pago eliminado correctamente"}
    except Exception as ex:
        session.rollback()
        print("Error al eliminar pago:", ex)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        session.close()