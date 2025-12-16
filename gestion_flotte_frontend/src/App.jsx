import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import GestionCamions from "./pages/GestionCamions.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Forbidden from "./pages/Forbidden.jsx";
import GestionChauffeurs from "./pages/GestionChauffeurs.jsx";
import GestionTrajets from "./pages/trajets/GestionTrajets.jsx";
import TrajetDetails from "./pages/trajets/TrajetsDetails.jsx";
import ChauffeurDashboard from "./pages/chauffeur/ChauffeurDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import GestionMaintenance from "./pages/GestionMaintenance.jsx";
import ChauffeurTrajets from "./pages/chauffeur/ChauffeurTrajets.jsx";

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
          <Route path="/maintenance" element={<GestionMaintenance />} />
        </Route>
        <Route element={<ProtectedRoute roles={["chauffeur"]} />}>
          <Route path="/chauffeur/chauffeurDashbord" element={<ChauffeurDashboard />} />
          <Route path="/chauffeur/MesTrajets" element={<ChauffeurTrajets />} />
        </Route>
        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
