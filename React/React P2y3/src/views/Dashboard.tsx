import { useNavigate } from "react-router-dom";


function Dashboard() {
 const navigate = useNavigate();


 const handleLogout = () => {
   localStorage.removeItem("user");
   localStorage.removeItem("token");
   navigate("/login");
 };

 

 const userName = JSON.parse(localStorage.getItem("user") || "{}").firstName;
 const userType = JSON.parse(localStorage.getItem("user") || "{}").type;


 return (
   <div>
     <h2>Dashboard</h2>
     <div>Hola Bienvenidooooo {userName} !</div>
     <div>Sos del tipo: {userType}</div>
     <button onClick={handleLogout}>Cerrar sesión</button>
   </div>
 );
}


export default Dashboard;