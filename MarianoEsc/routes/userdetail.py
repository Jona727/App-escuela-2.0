from fastapi import APIRouter
from models.modelo import session, UserDetail as UserDetailModel, InputUserDetails

UserDetail = APIRouter()  

@UserDetail.post("/userdetail/add")
def add_userdetail(userDet: InputUserDetails):
    try:

        newDetail = UserDetailModel(
            userDet.dni, 
            userDet.firstName, 
            userDet.lastName,
            userDet.type)
        session.add(newDetail)
        session.commit()
        return "Detalle de usuario agregado"
    except Exception as ex:
        return str(ex)  