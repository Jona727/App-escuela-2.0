import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./views/Dashboard";
import PublicRoutes from "./components/routes/PublicRoutes";
import ProtectedRoutes from "./components/routes/ProtectedRoutes";

function App() {
  return (
  <BrowserRouter>
     <Routes>
       <Route element={<PublicRoutes />}>
         <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
         <Route path="/signup" element={<Signup />} />
       </Route>


       <Route element={<ProtectedRoutes />}>
         <Route path="/dashboard" element={<Dashboard />} />
       </Route>
     </Routes>
   </BrowserRouter>

  );
}

export default App;