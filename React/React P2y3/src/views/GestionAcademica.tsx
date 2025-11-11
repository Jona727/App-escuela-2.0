import { useEffect, useState } from "react";

type Carrera = {
  id: number;
  name: string;
};

type Curso = {
  id: number;
  name: string;
  status: string;
  user_id?: number;
  career_id?: number;
};

type Asignacion = {
  id: number;
  curso_id: number;
  curso_nombre: string;
  carrera_id: number;
  carrera_nombre: string;
};

const GestionAcademica = () => {
  const [activeTab, setActiveTab] = useState("carreras");
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nuevaCarrera, setNuevaCarrera] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoNombre, setCursoNombre] = useState("");
  const [cursoStatus, setCursoStatus] = useState("");
  const [cursoSeleccionado, setCursoSeleccionado] = useState("");
  const [careerId, setCareerId] = useState("");
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);

  useEffect(() => {
    fetchCarreras();
    fetchCursos();
    fetchAsignaciones();
  }, []);

  const fetchCarreras = async () => {
    const res = await fetch("http://localhost:8000/careers/all");
    const data = await res.json();
    setCarreras(data);
  };

  const fetchCursos = async () => {
    const res = await fetch("http://localhost:8000/cursos/all");
    const data = await res.json();
    setCursos(data);
  };

  const fetchAsignaciones = async () => {
    const res = await fetch("http://localhost:8000/asignaciones/all");
    const data = await res.json();
    setAsignaciones(data);
  };

  const crearCarrera = async () => {
    await fetch("http://localhost:8000/careers/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nuevaCarrera })
    });
    setNuevaCarrera("");
    fetchCarreras();
  };

  const eliminarCarrera = async (id: number) => {
    await fetch(`http://localhost:8000/careers/${id}`, { method: "DELETE" });
    fetchCarreras();
  };

  const crearCurso = async () => {
    await fetch("http://localhost:8000/curso/AddCurso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: cursoNombre, status: cursoStatus, career_id: parseInt(careerId) })
    });
    setCursoNombre("");
    setCursoStatus("");
    setCareerId("");
    fetchCursos();
  };

  const eliminarCurso = async (id: number) => {
    await fetch(`http://localhost:8000/curso/delete/${id}`, { method: "DELETE" });
    fetchCursos();
  };

  const asignarCarreraACurso = async () => {
    await fetch("http://localhost:8000/asignaciones/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ curso_id: parseInt(cursoSeleccionado), career_id: parseInt(careerId) })
    });
    fetchAsignaciones();
  };

  const eliminarAsignacion = async (id: number) => {
    await fetch(`http://localhost:8000/asignaciones/${id}`, { method: "DELETE" });
    fetchAsignaciones();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión Académica</h1>
      <div className="flex space-x-4 mb-6">
        {['carreras', 'cursos', 'asignaciones'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "carreras" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Materia</h2>
          <input type="text" placeholder="Nombre de la Materia" className="border p-2 mr-2" value={nuevaCarrera} onChange={(e) => setNuevaCarrera(e.target.value)} />
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={crearCarrera}>Crear</button>
          <ul className="mt-4">
            {carreras.map((carrera) => (
              <li key={carrera.id} className="p-2 border-b flex justify-between">
                {carrera.name}
                <button className="text-red-500" onClick={() => eliminarCarrera(carrera.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "cursos" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Cursos</h2>
          <input type="text" placeholder="Nombre del curso" className="border p-2 mr-2" value={cursoNombre} onChange={(e) => setCursoNombre(e.target.value)} />
          <input type="text" placeholder="Estado" className="border p-2 mr-2" value={cursoStatus} onChange={(e) => setCursoStatus(e.target.value)} />
          <select className="border p-2 mr-2" value={careerId} onChange={(e) => setCareerId(e.target.value)}>
            <option value="">Seleccionar Materia</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={crearCurso}>Crear</button>
          <ul className="mt-4">
            {cursos.map((curso) => (
              <li key={curso.id} className="p-2 border-b flex justify-between">
                {curso.name} ({curso.status})
                <button className="text-red-500" onClick={() => eliminarCurso(curso.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === "asignaciones" && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Asignar Materia a Cursos</h2>
          <select className="border p-2 mr-2" value={cursoSeleccionado} onChange={(e) => setCursoSeleccionado(e.target.value)}>
            <option value="">Seleccionar curso</option>
            {cursos.map((curso) => (
              <option key={curso.id} value={curso.id}>{curso.name}</option>
            ))}
          </select>
          <select className="border p-2 mr-2" value={careerId} onChange={(e) => setCareerId(e.target.value)}>
            <option value="">Seleccionar Materia</option>
            {carreras.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={asignarCarreraACurso}>Asignar</button>

          <ul className="mt-4">
            {asignaciones.map((a) => (
              <li key={a.id} className="p-2 border-b flex justify-between">
                Curso: {a.curso_nombre} - Carrera: {a.carrera_nombre}
                <button className="text-red-500" onClick={() => eliminarAsignacion(a.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GestionAcademica;
