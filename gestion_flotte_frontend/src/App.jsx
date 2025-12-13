import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GestionCamions from "./pages/GestionCamions.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboardAdmin" element={<Dashboard />} />
          <Route path="/camions" element={<GestionCamions />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
