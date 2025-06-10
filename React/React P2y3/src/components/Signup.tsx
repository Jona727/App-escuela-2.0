import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const user = userRef.current?.value;
    const password = passRef.current?.value;

    fetch("http://localhost:8000/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username: user, password: password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setMsg(`¡Usuario creado! ID: ${data.user.id}`);
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        } else {
          setMsg(`Error: ${data.message}`);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMsg("Error al conectar con el servidor");
      });
  }

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label>Username</label>
          <input ref={userRef} className="form-control" />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" ref={passRef} className="form-control" />
        </div>
        <button type="submit" className="btn btn-success">Crear cuenta</button>
        <div className="mt-2 text-danger">{msg}</div>
        <div className="mt-3">
          ¿Ya tenés cuenta?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate('/')}
          >
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;