import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

type LoginProcessResponse = {
  status: string;
  token?: string;
  user?: unknown;
  message?: string;
};

function Login() {
  const BACKEND_IP = "localhost";
  const BACKEND_PORT = "8000";
  const ENDPOINT = "users/loginUser";
  const LOGIN_URL = `http://${BACKEND_IP}:${BACKEND_PORT}/${ENDPOINT}`;

  const userInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.status === "success") {
      localStorage.setItem("token", dataObject.token ?? "");
      localStorage.setItem("user", JSON.stringify(dataObject.user));
      setMessage("Iniciando sesión...");

      // Redirigir según el tipo de usuario
      const user = dataObject.user as { type?: string };
      const userType = user?.type?.toLowerCase();

      if (userType === "administrador") {
        navigate("/admin-dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      // Mejorar mensajes del backend
      const backendMessage = dataObject.message?.toLowerCase() || "";

      if (backendMessage.includes("invalid") || backendMessage.includes("password") || backendMessage.includes("username")) {
        setMessage("Usuario o contraseña incorrectos");
      } else if (backendMessage.includes("not found")) {
        setMessage("Usuario no encontrado");
      } else {
        setMessage("Error al iniciar sesión. Intenta nuevamente");
      }
    }
  }

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username = userInputRef.current?.value ?? "";
    const password = passInputRef.current?.value ?? "";

    // Validación frontend
    if (!username.trim() || !password.trim()) {
      setMessage("Por favor, completa todos los campos");
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({ username, password });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(LOGIN_URL, requestOptions)
      .then((response) => response.json())
      .then((dataObject) => loginProcess(dataObject))
      .catch((error) => {
        console.error("Error durante el inicio de sesión:", error);
        setMessage("No se pudo conectar con el servidor. Verifica tu conexión.");
      });
  }

  function checkNewPassword(p: string) {
    const minLength = 8;
    const hasNumber = /\d/.test(p);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(p);

    if (p.length < minLength) {
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      return false;
    }

    if (!hasNumber) {
      setMessage("La contraseña debe contener al menos un número.");
      return false;
    }

    if (!hasSpecialChar) {
      setMessage("La contraseña debe contener al menos un carácter especial.");
      return false;
    }

    setMessage(null); // Limpia el mensaje si pasa todas las validaciones
    return true;
  }

  useEffect(() => {
    if (newPassword) {
      checkNewPassword(newPassword);
    }
  }, [newPassword]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "20px",
        position: "relative"
      }}
    >
      <div
        style={{
          maxWidth: "360px",
          width: "100%",
          background: "white",
          borderRadius: "12px",
          padding: "60px 40px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.12)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "50px",
            color: "#333",
            fontSize: "28px",
            fontWeight: "600"
          }}
        >
          Bienvenido
        </h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <input
              type="text"
              ref={userInputRef}
              placeholder="Usuario"
              style={{
                width: "100%",
                padding: "12px 0",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #ddd",
                color: "#333",
                fontSize: "16px",
                outline: "none"
              }}
            />
          </div>

          <div style={{ marginBottom: "40px", position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              ref={passInputRef}
              placeholder="Contraseña"
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 35px 12px 0",
                background: "transparent",
                border: "none",
                borderBottom: "1px solid #ddd",
                color: "#333",
                fontSize: "16px",
                outline: "none"
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "0",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666"
              }}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "14px",
              background: "#4CAF50",
              border: "none",
              borderRadius: "25px",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              marginBottom: "30px",
              textTransform: "uppercase",
              letterSpacing: "1px"
            }}
          >
            INICIAR SESIÓN
          </button>

          {message && (
            <div style={{ color: "#666", textAlign: "center", marginBottom: "20px", fontSize: "13px" }}>
              {message}
            </div>
          )}
        </form>
      </div>

      {/* Footer con nombre del instituto */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          fontSize: "14px",
          color: "#4f4a4aff",
          fontWeight: "400",
          letterSpacing: "0.5px"
        }}
      >
        © 2025 Instituto Mariano Moreno
      </div>
    </div>
  );
}

export default Login;