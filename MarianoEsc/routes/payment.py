from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from models.modelo import Payment, inputPayment, User, Session
from sqlalchemy.orm import joinedload
from typing import Optional
from datetime import datetime


payment = APIRouter()

# ENDPOINT VIEJO SIN PAGINACION PARA TRAER PAGOS
@payment.get("/payment/all/detailled")
def get_payments():
    db = Session()
    try:
        paymentsDetailled = []
        allPayments = db.query(Payment).options(
            joinedload(Payment.user).joinedload(User.userdetail),
            joinedload(Payment.curso)
        ).all()

        for pay in allPayments:
            # Validar que existan las relaciones antes de acceder a ellas
            if not pay.user or not pay.user.userdetail:
                continue

            result = {
                "id_pago": pay.id,
                "monto": pay.amount,
                "fecha_de_pago": pay.created_at,
                "mes_pagado": pay.affect_month,
                "alumno": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                "curso_afectado": pay.curso.name if pay.curso else "Sin curso asignado"
            }
            paymentsDetailled.append(result)
        return paymentsDetailled
    except Exception as e:
        db.rollback()
        print("Error al obtener pagos detallados:", e)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Error al obtener pagos: {str(e)}")
    finally:
        db.close()

#PAGINADO PARA TRAER ALL PAGOS
@payment.get("/payment/paginated")
def get_payments_paginated(
    user_id: Optional[int] = Query(None),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    limit: int = Query(20, gt=0, le=100),
    last_seen_id: Optional[int] = Query(None),
):
    db = Session()
    try:
        query = (
            db.query(Payment)
            .options(
                joinedload(Payment.user).joinedload(User.userdetail),
                joinedload(Payment.curso)
            )
            .order_by(Payment.id)
        )

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
            # Validar que existan las relaciones
            if not pay.user or not pay.user.userdetail:
                continue

            result = {
                "id_pago": pay.id,
                "monto": pay.amount,
                "fecha_de_pago": pay.created_at,
                "mes_pagado": pay.affect_month,
                "alumno": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                "curso_afectado": pay.curso.name if pay.curso else "Sin curso asignado",
            }
            paymentsDetailled.append(result)

        next_cursor = paymentsDetailled[-1]["id_pago"] if len(paymentsDetailled) == limit else None

        return {
            "payments": paymentsDetailled,
            "next_cursor": next_cursor
        }

    except Exception as e:
        db.rollback()
        print("Error al obtener pagos:", e)
        import traceback
        traceback.print_exc()
        return JSONResponse(
            status_code=500, content={"detail": f"Error al obtener pagos: {str(e)}"}
        )
    finally:
        db.close()

@payment.get("/payment/user/{_username}")
def payament_user(_username: str):
    db = Session()
    try:
        userEncontrado = (
            db.query(User)
            .options(joinedload(User.userdetail))
            .filter(User.username == _username)
            .first()
        )
        arraySalida = []
        if userEncontrado:
            payments = userEncontrado.payments
            for pay in payments:
                if not pay.user or not pay.user.userdetail:
                    continue

                payment_detail = {
                    "id": pay.id,
                    "amount": pay.amount,
                    "fecha_pago": pay.created_at,
                    "usuario": f"{pay.user.userdetail.firstName} {pay.user.userdetail.lastName}",
                    "curso": pay.curso.name if pay.curso else "Sin curso asignado",
                    "mes_afectado": pay.affect_month
                }
                arraySalida.append(payment_detail)
            return arraySalida
        else:
            return {"error": "Usuario no encontrado"}
    except Exception as ex:
        db.rollback()
        print("Error al traer usuario y/o pagos:", ex)
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        db.close()

@payment.post("/payment/add")
def add_payment(pay: inputPayment):
    db = Session()
    try:
        newPayment = Payment(
            curso_id=pay.curso_id,
            user_id=pay.user_id,
            amount=pay.amount,
            affect_month=pay.affect_month
        )
        db.add(newPayment)
        db.commit()
        db.refresh(newPayment)
        res = f"Pago para el alumno {newPayment.user.userdetail.firstName} {newPayment.user.userdetail.lastName}, guardado"
        return {"status": "success", "message": res}
    except Exception as ex:
        db.rollback()
        print("Error al guardar pago:", ex)
        raise HTTPException(status_code=500, detail=f"Error al guardar pago: {str(ex)}")
    finally:
        db.close()

@payment.delete("/payment/delete/{payment_id}")
def delete_payment(payment_id: int):
    db = Session()
    try:
        pago = db.query(Payment).filter(Payment.id == payment_id).first()
        if not pago:
            raise HTTPException(status_code=404, detail="Pago no encontrado")

        db.delete(pago)
        db.commit()
        return {"status": "success", "message": "Pago eliminado correctamente"}
    except Exception as ex:
        db.rollback()
        print("Error al eliminar pago:", ex)
        raise HTTPException(status_code=500, detail="Error interno del servidor")
    finally:
        db.close()