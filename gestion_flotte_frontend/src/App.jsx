import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import GestionCamions from "./pages/GestionCamions.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import GestionChauffeurs from "./pages/GestionChauffeurs.jsx";
import GestionTrajets from "./pages/trajets/GestionTrajets.jsx";
import TrajetDetails from "./pages/trajets/TrajetsDetails.jsx";
import ChauffeurDashboard from "./pages/ChauffeurDashboard.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/camions" element={<GestionCamions />} />
          <Route path="/chauffeurs" element={<GestionChauffeurs />} />
          <Route path="/trajets" element={<GestionTrajets />} />
          <Route path="/trajet-details/:id" element={<TrajetDetails />} />
        </Route>
        <Route element={<ProtectedRoute roles={["chauffeur"]} />}>
          <Route path="/chauffeurDashbord" element={<ChauffeurDashboard />} />
        </Route>
        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
