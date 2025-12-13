import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import GestionCamions from "./pages/GestionCamions.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Forbidden from "./pages/Forbidden.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/camions" element={<GestionCamions />} />
        </Route>
        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
