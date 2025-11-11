import datetime, pytz, jwt

class Security:
    secret = "cualquier cosa"

    @classmethod
    def hoy(cls): 
        return datetime.datetime.now(pytz.timezone("America/Buenos_Aires"))

    @classmethod
    def generate_token(cls, authUser):
        payload = {
            "iat": cls.hoy(),
            "exp": cls.hoy() + datetime.timedelta(minutes=480),
            "id": authUser.id,
            "username": authUser.username
        }
        try:
            return jwt.encode(payload, cls.secret, algorithm="HS256")
        except Exception:
            return None

    @classmethod
    def verify_token(cls, headers):
        try:
            auth_header = headers.get("authorization")
            if not auth_header:
                return {"status": "error", "message": "Header de autorización inexistente"}

            tkn = auth_header.split(" ")[1]
            payload = jwt.decode(tkn, cls.secret, algorithms=["HS256"])
            return payload

        except jwt.ExpiredSignatureError:
            return {"status": "error", "message": "El token ha expirado!"}
        except jwt.InvalidSignatureError:
            return {"status": "error", "message": "Error de firma inválida!"}
        except jwt.DecodeError:
            return {"status": "error", "message": "Error de decodificación de token!"}
        except Exception as e:
            print("Error desconocido durante validación del token:", e)
            return {"status": "error", "message": "Error desconocido durante la validación del token!"}