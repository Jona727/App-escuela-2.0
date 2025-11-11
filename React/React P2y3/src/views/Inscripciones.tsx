import { useEffect, useState } from "react";

type Alumno = {
  id: number;
  username: string;
  email: string;
  dni: string;
  firstname: string;
  lastname: string;
  type: string;
};

type Curso = {
  id: number;
  name: string;
  status: string;
};

const Inscripciones = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState("");
  const [selectedCurso, setSelectedCurso] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const cargarAlumnos = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/users/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const soloAlumnos = data.filter((user: Alumno) =>
            user.type.toLowerCase().includes("alumno")
          );
          setAlumnos(soloAlumnos);
        } else {
          console.error("Error al cargar alumnos:", await res.text());
        }
      } catch (error) {
        console.error("Error al cargar alumnos:", error);
      }
    };

    const cargarCursos = async () => {
      try {
        const res = await fetch("http://localhost:8000/cursos/all");
        if (res.ok) {
          const data = await res.json();
          setCursos(data);
        } else {
          console.error("Error al cargar cursos:", await res.text());
        }
      } catch (error) {
        console.error("Error al cargar cursos:", error);
      }
    };

    cargarAlumnos();
    cargarCursos();
  }, []);

  const handleInscribir = async () => {
    if (!selectedAlumno || !selectedCurso) {
      setMessage("Por favor selecciona un alumno y un curso");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/user/addcurso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_user: parseInt(selectedAlumno),
          id_curso: parseInt(selectedCurso),
        }),
      });

      if (res.ok) {
        const responseText = await res.text();
        setMessage(responseText);
        setSelectedAlumno("");
        setSelectedCurso("");
      } else {
        const errorData = await res.json();
        setMessage(errorData.detail || "Error al inscribir alumno");
      }
    } catch (error) {
      setMessage("Error de conexión con el servidor");
      console.error("Error al inscribir:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inscripciones</h1>
          <p className="text-gray-600 mt-2">Asigna alumnos a Cursos</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Nueva Inscripción</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Alumno
            </label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedAlumno}
              onChange={(e) => setSelectedAlumno(e.target.value)}
            >
              <option value="">Seleccionar alumno...</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.firstname} {alumno.lastname} - DNI: {alumno.dni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Curso
            </label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedCurso}
              onChange={(e) => setSelectedCurso(e.target.value)}
            >
              <option value="">Seleccionar curso...</option>
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleInscribir}
          disabled={loading}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Inscribiendo..." : "Inscribir Alumno"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estado de Carga</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Alumnos cargados:</span> {alumnos.length}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Cursos disponibles:</span> {cursos.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inscripciones;
