import React, { useEffect } from "react";
import {
  FaRoute,
  FaCheckCircle,
  FaClock,
  FaPlayCircle,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaTruck,
  FaMapMarkedAlt,
  FaGasPump,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar.jsx";
import StatCard from "../../components/StatCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getTrajetsChauffeur } from "../../features/trajetSlice.js";
import useAuth from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";

const ChauffeurDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trajetsChauffeur } = useSelector((state) => state.trajets);

  const totalTrajets = trajetsChauffeur.length;
  const enCours = trajetsChauffeur.filter(
    (t) => t.statut === "en_cours"
  ).length;
  const termines = trajetsChauffeur.filter(
    (t) => t.statut === "terminé"
  ).length;
  const aFaire = trajetsChauffeur.filter((t) => t.statut === "à_faire").length;

  // Calcul des statistiques
  const totalKm = trajetsChauffeur.reduce((sum, t) => {
    if (t.kmArrivee && t.kmDepart) {
      return sum + (Number(t.kmArrivee) - Number(t.kmDepart));
    }
    return sum;
  }, 0);

  const totalGasoil = trajetsChauffeur.reduce((sum, t) => {
    return sum + (Number(t.volumeGasoil) || 0);
  }, 0);

  useEffect(() => {
    if (user?.id) {
      dispatch(getTrajetsChauffeur(user.id));
    }
  }, [dispatch, user]);

  const trajetsRecents = trajetsChauffeur.slice(0, 5);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Tableau de Bord Chauffeur
          </h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-[#206ab1]"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <FaBell className="text-2xl text-gray-600 cursor-pointer hover:text-[#002D74]" />
            <FaUserCircle className="text-3xl text-gray-600 cursor-pointer hover:text-[#002D74]" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={<FaRoute />}
              title="Trajets assignés"
              value={totalTrajets}
              color="text-[#002D74]"
            />
            <StatCard
              icon={<FaClock />}
              title="À faire"
              value={aFaire}
              color="text-amber-500"
            />
            <StatCard
              icon={<FaPlayCircle />}
              title="En cours"
              value={enCours}
              color="text-green-500"
            />
            <StatCard
              icon={<FaCheckCircle />}
              title="Terminés"
              value={termines}
              color="text-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Statistiques supplémentaires */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaTruck className="mr-2 text-[#002D74]" />
                Mes Performances
              </h2>

              <div className="space-y-4">
                {/* Kilométrage total */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center">
                    <FaMapMarkedAlt className="text-2xl text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Kilométrage Total</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {totalKm.toLocaleString()} km
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consommation gasoil */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center">
                    <FaGasPump className="text-2xl text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Gasoil Total</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {totalGasoil.toLocaleString()} L
                      </p>
                    </div>
                  </div>
                </div>

                {/* Consommation moyenne */}
                {totalKm > 0 && (
                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center">
                      <FaGasPump className="text-2xl text-purple-600 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">
                          Consommation Moyenne
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {((totalGasoil / totalKm) * 100).toFixed(2)} L/100km
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trajets récents */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Trajets Récents
                </h2>
                <button
                  onClick={() => navigate("/chauffeur/MesTrajets")}
                  className="text-[#002D74] font-semibold hover:underline"
                >
                  Voir tous →
                </button>
              </div>

              <div className="space-y-3">
                {trajetsRecents.length > 0 ? (
                  trajetsRecents.map((trajet) => (
                    <div
                      key={trajet._id}
                      className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate("/chauffeur/MesTrajets")}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {trajet.lieuDepart} → {trajet.lieuArrivee}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(trajet.dateDepart).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            trajet.statut === "terminé"
                              ? "bg-green-100 text-green-700"
                              : trajet.statut === "en_cours"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {trajet.statut}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Aucun trajet assigné
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section Action rapide */}
          <div className="bg-gradient-to-r from-[#002D74] to-[#206ab1] p-6 rounded-2xl shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">Actions Rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/chauffeur/trajets")}
                className="bg-white text-[#002D74] p-4 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center justify-center"
              >
                <FaRoute className="mr-2" />
                Consulter mes trajets
              </button>
              <button className="bg-white bg-opacity-20 p-4 rounded-xl font-semibold hover:bg-opacity-30 duration-300 flex items-center justify-center">
                <FaBell className="mr-2" />
                Voir les notifications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChauffeurDashboard;
