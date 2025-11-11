function AdminDashboard() {

 const userName = JSON.parse(localStorage.getItem("user") || "{}").firstName;
 const userType = JSON.parse(localStorage.getItem("user") || "{}").type;


 return (
   <div>
     <h2>Admin Dashboard</h2>
     <div>Hola Bienvenidooooo {userName} !</div>
     <div>Sos del tipo: {userType}</div>
   </div>
 );
}


export default AdminDashboard;