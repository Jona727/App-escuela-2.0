import { useEffect, useState } from "react";

// Tipos
interface Usuario {
  id: number;
  firstname: string;
  lastname: string;
}

interface Curso {
  id: number;
  name: string;
}

interface Pago {
  id: number;
  amount: number;
  fecha_pago: string;
  mes_afectado: string;
  usuario: string;
  carrera: string;
}

const Pagos = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);

  const [usuarioPago, setUsuarioPago] = useState("");
  const [cursoPago, setCursoPago] = useState("");
  const [monto, setMonto] = useState("");
  const [mesPago, setMesPago] = useState("");

  const mesActual = new Date().toISOString().slice(0, 7);

  const pagosFiltrados = pagos.filter(p =>
    usuarioPago ? p.usuario?.includes(usuarioPago) : true
  );

  const totalMes = pagosFiltrados
    .filter(p => p.mes_afectado === mesActual)
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalAnual = pagosFiltrados
    .filter(p => p.mes_afectado?.startsWith(mesActual.slice(0, 4)))
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const totalGeneral = pagosFiltrados.reduce(
    (acc, p) => acc + (p.amount || 0),
    0
  );

  useEffect(() => {
    fetch("http://localhost:8000/users/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error al cargar usuarios:", err);
        setUsuarios([]);
      });

    fetch("http://localhost:8000/cursos/all")
      .then(res => res.json())
      .then(data => setCursos(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error al cargar cursos:", err);
        setCursos([]);
      });

    fetch("http://localhost:8000/payment/all/detailled")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pagosFormateados = data.map((p: any) => ({
            id: p.id_pago,
            amount: p.monto,
            fecha_pago: p.fecha_de_pago,
            mes_afectado: p.mes_pagado.slice(0, 7),
            usuario: p.alumno,
            carrera: p.curso_afectado,
          }));
          setPagos(pagosFormateados);
        } else {
          setPagos([]);
        }
      })
      .catch(err => {
        console.error("Error al cargar pagos:", err);
        setPagos([]);
      });
  }, []);

  const registrarPago = () => {
    if (!usuarioPago || !cursoPago || !monto || !mesPago) {
      alert("Por favor completa todos los campos");
      return;
    }

    const fechaAfectada = `${mesPago}-01`;

    fetch("http://localhost:8000/payment/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: parseInt(usuarioPago),
        curso_id: parseInt(cursoPago),
        amount: parseFloat(monto),
        affect_month: fechaAfectada,
      }),
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(() => {
        setUsuarioPago("");
        setCursoPago("");
        setMonto("");
        setMesPago("");
        window.location.reload();
      })
      .catch(err => {
        console.error("Error al registrar pago:", err);
        alert("Error al registrar el pago");
      });
  };

  const eliminarPago = (id: number) => {
    fetch(`http://localhost:8000/payment/delete/${id}`, {
      method: "DELETE",
    })
      .then(res => res.json())
      .then(() => setPagos(pagos.filter(p => p.id !== id)));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Pagos</h1>
          <p className="text-gray-600 mt-2">Administra pagos y cuotas</p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-700">Total del Mes</h3>
          <p className="text-2xl font-bold text-green-600">${totalMes}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-700">Total del Año</h3>
          <p className="text-2xl font-bold text-blue-600">${totalAnual}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h3 className="text-gray-700">Total General</h3>
          <p className="text-2xl font-bold text-purple-600">${totalGeneral}</p>
        </div>
      </div>

      {/* Registro */}
      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="font-bold mb-2">Registrar nuevo pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select
            value={usuarioPago}
            onChange={e => setUsuarioPago(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar alumno</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.firstname} {u.lastname}
              </option>
            ))}
          </select>

          <select
            value={cursoPago}
            onChange={e => setCursoPago(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Seleccionar curso</option>
            {cursos.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Monto"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="month"
            value={mesPago}
            onChange={e => setMesPago(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <button
          onClick={registrarPago}
          className="bg-green-600 text-white mt-4 px-4 py-2 rounded hover:bg-green-700"
        >
          Registrar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white mt-6 rounded shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Alumno</th>
              <th className="px-4 py-2 text-left">Curso</th>
              <th className="px-4 py-2 text-left">Monto</th>
              <th className="px-4 py-2 text-left">Mes</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagosFiltrados.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.usuario}</td>
                <td className="px-4 py-2">{p.carrera}</td>
                <td className="px-4 py-2">${p.amount}</td>
                <td className="px-4 py-2">{p.mes_afectado}</td>
                <td className="px-4 py-2">
                  {new Date(p.fecha_pago).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => eliminarPago(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Pagos;
