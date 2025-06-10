import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  type LoginProcessResponse = {
    status: string;
    token?: string;
    user?: unknown;
    message?: string;
  };

  function loginProcess(dataObject: LoginProcessResponse) {
    if (dataObject.status === "success") {
      localStorage.setItem("token", dataObject.token ?? "");
      localStorage.setItem("user", JSON.stringify(dataObject.user)); 
      setMsg("Initiating session...");
      navigate("/dashboard"); 
    } else {
      setMsg(dataObject.message ?? "Unknown error");
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      username: userRef.current?.value,
      password: passRef.current?.value,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("http://localhost:8000/users/loginUser", requestOptions)
      .then((respond) => respond.json())
      .then((dataObject) => loginProcess(dataObject))
      .catch((error) => console.log("error", error));
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="exampleInputUser1" className="form-label">
              User
            </label>
            <input
              ref={userRef}
              type="text"
              className="form-control"
              id="exampleInputUser1"
              aria-describedby="userHelp"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              ref={passRef}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>
          <span className="ms-3 text-danger">{msg}</span>

          <div className="mt-3">
            ¿No tenés cuenta?{" "}
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={() => navigate('/signup')}
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;