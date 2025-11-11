import { useEffect, useRef, useState } from "react";

type Usuario = {
  id: number;
  username: string;
  email: string;
  dni: string;
  firstname: string;
  lastname: string;
  type: string;
};

function User() {
  const userRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dniRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState("Alumno");
  const [msg, setMsg] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modoEdicion, setModoEdicion] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
  try {
    const res = await fetch("http://localhost:8000/users/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      console.error("Error al cargar usuarios:", res.statusText);
      setUsuarios([]);
      return;
    }

    const data = await res.json();
    console.log("Respuesta del backend:", data);

    if (Array.isArray(data)) {
      // Caso: el backend devuelve directamente una lista de usuarios
      setUsuarios(data);
    } else if (Array.isArray(data.users)) {
      // Caso: el backend devuelve un objeto con la propiedad "users"
      setUsuarios(data.users);
    } else {
      console.error("Formato de respuesta inesperado:", data);
      setUsuarios([]);
    }
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    setUsuarios([]);
  }
};


  const limpiar = () => {
if (firstNameRef.current) firstNameRef.current.value = "";
if (lastNameRef.current) lastNameRef.current.value = "";
if (dniRef.current) dniRef.current.value = "";
if (emailRef.current) emailRef.current.value = "";
if (userRef.current) userRef.current.value = "";
if (passRef.current) passRef.current.value = "";

    setType("Alumno");
    setModoEdicion(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevo = {
      username: userRef.current?.value,
      password: passRef.current?.value,
      email: emailRef.current?.value,
      dni: parseInt(dniRef.current?.value || "0"),
      firstname: firstNameRef.current?.value,
      lastname: lastNameRef.current?.value,
      type: type,
    };

    const url = modoEdicion
      ? `http://localhost:8000/users/profile/${modoEdicion.id}`
      : "http://localhost:8000/users/signup";

    const method = modoEdicion ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(nuevo),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Usuario guardado correctamente");
      fetchUsuarios();
      limpiar();
    } else {
      setMsg(data.message || "Error");
    }
  };

  const handleEditar = (u: Usuario) => {
    setModoEdicion(u);
    userRef.current!.value = u.username;
    emailRef.current!.value = u.email;
    dniRef.current!.value = u.dni;
    firstNameRef.current!.value = u.firstname;
    lastNameRef.current!.value = u.lastname;
    setType(u.type);
  };

  const handleEliminar = async (id: number) => {
    const confirmacion = confirm("¿Estás seguro que deseas eliminar este usuario?");
    if (!confirmacion) return;

    const res = await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Usuario eliminado correctamente");
      fetchUsuarios();
    } else {
      setMsg(data.message || "Error al eliminar");
    }
  };

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-4">{modoEdicion ? "Editar usuario" : "Crear usuario"}</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input ref={userRef} className="form-control mb-2" placeholder="Username" />
        {!modoEdicion && (
          <input type="password" ref={passRef} className="form-control mb-2" placeholder="Password" />
        )}
        <input type="email" ref={emailRef} className="form-control mb-2" placeholder="Email" />
        <input type="number" ref={dniRef} className="form-control mb-2" placeholder="DNI" />
        <input ref={firstNameRef} className="form-control mb-2" placeholder="Nombre" />
        <input ref={lastNameRef} className="form-control mb-2" placeholder="Apellido" />
        <select className="form-control mb-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Alumno">Alumno</option>
          <option value="Administrador">Administrador</option>
        </select>
        <button type="submit" className="btn btn-success">
          {modoEdicion ? "Guardar cambios" : "Crear usuario"}
        </button>
        {modoEdicion && (
          <button
            type="button"
            onClick={limpiar}
            className="btn btn-secondary ml-2"
          >
            Cancelar
          </button>
        )}
        <div className="text-danger mt-2">{msg}</div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Usuarios registrados</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.firstname} {u.lastname}</td>
              <td>{u.type}</td>
              <td>
                <button onClick={() => handleEditar(u)} className="btn btn-primary btn-sm mr-2">Editar</button>
                <button onClick={() => handleEliminar(u.id)} className="btn btn-danger btn-sm">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default User;
