import React, { useEffect, useState } from "react";
import {
  FaRoute,
  FaFilePdf,
  FaClock,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaTruck,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaFilter,
} from "react-icons/fa";
import Sidebar from "../../components/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  getTrajetsChauffeur,
  updateTrajetChauffeur,
} from "../../features/trajetSlice.js";
import useAuth from "../../hooks/useAuth.js";
import TrajetChauffeurModal from "../../components/modals/TrajetCauffeurModal.jsx";

const ChauffeurTrajets = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrajet, setSelectedTrajet] = useState(null);
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useAuth();
  const { trajetsChauffeur, loading , loadingDetail } = useSelector((state) => state.trajets);

  useEffect(() => {
    if (user?.id) {
      dispatch(getTrajetsChauffeur(user.id));
    }
  }, [dispatch, user]);

  const openTrajetModal = (trajet) => {
    setSelectedTrajet(trajet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrajet(null);
  };

  const handleSaveTrajet = async (trajetData) => {
    if (selectedTrajet?._id) {
      await dispatch(
        updateTrajetChauffeur({ id: selectedTrajet._id, data: trajetData })).unwrap();
      dispatch(getTrajetsChauffeur(user.id));
      handleCloseModal();
    }
  };

  const handleDownloadPDF = (trajet) => {
    // TODO: Implémenter la génération PDF
    console.log("Télécharger PDF pour trajet:", trajet._id);
    alert("Fonctionnalité PDF en cours de développement");
  };

  // Filtrage des trajets
  const trajetsFiltres = trajetsChauffeur.filter((trajet) => {
    const matchStatut =
      filtreStatut === "tous" || trajet.statut === filtreStatut;
    const matchSearch =
      trajet.lieuDepart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trajet.lieuArrivee.toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatut && matchSearch;
  });

  const getStatutBadge = (statut) => {
    switch (statut) {
      case "terminé":
        return "bg-green-100 text-green-700";
      case "en_cours":
        return "bg-blue-100 text-blue-700";
      case "à faire":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatutIcon = (statut) => {
    switch (statut) {
      case "terminé":
        return "✓";
      case "en_cours":
        return "⟳";
      case "à faire":
        return "○";
      default:
        return "?";
    }
  };

  if (loading || loadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaRoute className="mr-3 text-[#002D74]" />
            Mes Trajets
          </h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un trajet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
          {/* Filtres */}
          <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FaFilter className="text-gray-600" />
                <span className="font-semibold text-gray-700">
                  Filtrer par statut:
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setFiltreStatut("tous")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filtreStatut === "tous"
                      ? "bg-[#002D74] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Tous ({trajetsChauffeur.length})
                </button>
                <button
                  onClick={() => setFiltreStatut("à faire")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filtreStatut === "à faire"
                      ? "bg-amber-500 text-white"
                      : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                  }`}
                >
                  À faire (
                  {
                    trajetsChauffeur.filter((t) => t.statut === "à faire")
                      .length
                  }
                  )
                </button>
                <button
                  onClick={() => setFiltreStatut("en_cours")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filtreStatut === "en_cours"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  }`}
                >
                  En cours (
                  {
                    trajetsChauffeur.filter((t) => t.statut === "en_cours")
                      .length
                  }
                  )
                </button>
                <button
                  onClick={() => setFiltreStatut("terminé")}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    filtreStatut === "terminé"
                      ? "bg-green-500 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  Terminés (
                  {
                    trajetsChauffeur.filter((t) => t.statut === "terminé")
                      .length
                  }
                  )
                </button>
              </div>
            </div>
          </div>

          {/* Liste des trajets */}
          {trajetsFiltres.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trajetsFiltres.map((trajet) => (
                <div
                  key={trajet._id}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Header de la carte */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${getStatutBadge(
                          trajet.statut
                        )}`}
                      >
                        {getStatutIcon(trajet.statut)}
                      </div>
                      <div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${getStatutBadge(
                            trajet.statut
                          )}`}
                        >
                          {trajet.statut.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDownloadPDF(trajet)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Télécharger PDF"
                      >
                        <FaFilePdf size={20} />
                      </button>
                      {trajet.statut !== "terminé" && (
                        <button
                          onClick={() => openTrajetModal(trajet)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Mettre à jour"
                        >
                          <FaClock size={20} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trajet */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <FaMapMarkerAlt className="text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Départ</p>
                        <p className="font-bold text-gray-800">
                          {trajet.lieuDepart}
                        </p>
                      </div>
                    </div>

                    <div className="border-l-2 border-dashed border-gray-300 h-6 ml-2"></div>

                    <div className="flex items-center space-x-3">
                      <FaMapMarkerAlt className="text-red-500" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Arrivée</p>
                        <p className="font-bold text-gray-800">
                          {trajet.lieuArrivee}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-blue-500" />
                      <div>
                        <p className="text-xs text-gray-600">Départ</p>
                        <p className="text-sm font-semibold">
                          {new Date(trajet.dateDepart).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-purple-500" />
                      <div>
                        <p className="text-xs text-gray-600">Arrivée</p>
                        <p className="text-sm font-semibold">
                          {new Date(trajet.dateArrivee).toLocaleDateString(
                            "fr-FR"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Véhicules */}
                  <div className="bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FaTruck className="text-[#002D74]" />
                        <div>
                          <p className="text-xs text-gray-600">Camion</p>
                          <p className="text-sm font-bold">
                            {trajet.camionId?.immatriculation || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-600">Remorque</p>
                        <p className="text-sm font-bold">
                          {trajet.remorqueId?.immatriculation || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informations supplémentaires pour trajets terminés */}
                  {trajet.statut === "terminé" && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Distance</p>
                          <p className="font-bold">
                            {trajet.kmArrivee && trajet.kmDepart
                              ? `${(
                                  Number(trajet.kmArrivee) -
                                  Number(trajet.kmDepart)
                                ).toLocaleString()} km`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Gasoil</p>
                          <p className="font-bold">
                            {trajet.volumeGasoil
                              ? `${trajet.volumeGasoil} L`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl shadow-md text-center">
              <FaRoute className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Aucun trajet trouvé
              </h3>
              <p className="text-gray-600">
                {filtreStatut !== "tous"
                  ? `Aucun trajet avec le statut "${filtreStatut.replace(
                      "_",
                      " "
                    )}"`
                  : "Vous n'avez pas encore de trajets assignés"}
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      <TrajetChauffeurModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTrajet}
        selectedTrajet={selectedTrajet}
      />
    </div>
  );
};

export default ChauffeurTrajets;
