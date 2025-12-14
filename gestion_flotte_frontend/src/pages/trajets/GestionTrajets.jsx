import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Sidebar from "../../components/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrajet,
  getAllTrajets,
  deleteTrajet,
  getTrajetById,
} from "../../features/trajetSlice.js";
import { useNavigate } from "react-router-dom";
// import TrajetModal from "../components/TrajetModal.jsx";

const GestionTrajets = () => {
  const  navigate = useNavigate();
  const dispatch = useDispatch();

  const { trajets, loading, error, currentPage, totalPages, limit } =
    useSelector((state) => state.trajets);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrajet, setSelectedTrajet] = useState(null);

  useEffect(() => {
    dispatch(getAllTrajets({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleOpenModal = (trajet = null) => {
    setSelectedTrajet(trajet);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTrajet(null);
  };

  const handleSaveTrajet = async (trajetData) => {
    try {
      await dispatch(createTrajet(trajetData)).unwrap();
      dispatch(getAllTrajets({ page: currentPage, limit }));
      handleCloseModal();
    } catch (err) {
      console.error("Erreur création trajet :", err);
    }
  };

  const handleDeleteTrajet = async (id) => {
    try {
      if (window.confirm("Supprimer ce trajet ?")) {
        await dispatch(deleteTrajet(id)).unwrap();
        dispatch(getAllTrajets({ page: currentPage, limit }));
      }
    } catch (err) {
      console.error("Erreur suppression trajet :", err);
    }
  };

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des Trajets
          </h1>

          <button
            onClick={() => handleOpenModal()}
            className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold flex items-center hover:scale-105 duration-300"
          >
            <FaPlus className="mr-2" /> Ajouter un Trajet
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold">Chauffeur</th>
                  <th className="p-4 font-semibold">Camion</th>
                  <th className="p-4 font-semibold">Remorque</th>
                  <th className="p-4 font-semibold">Départ</th>
                  <th className="p-4 font-semibold">Arrivée</th>
                  <th className="p-4 font-semibold">Date départ</th>
                  <th className="p-4 font-semibold">Date arrivée</th>
                  {/* <th className="p-4 font-semibold">KM Départ</th>
                  <th className="p-4 font-semibold">KM Arrivée</th>
                  <th className="p-4 font-semibold">Volume Gasoil</th> */}
                  <th className="p-4 font-semibold">Statut</th>
                  {/* <th className="p-4 font-semibold">Remarque</th> */}
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {trajets.map((trajet) => (
                  <tr key={trajet._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{trajet.chauffeurId?.nom}</td>
                    <td className="p-4">{trajet.camionId?.immatriculation}</td>
                    <td className="p-4">
                      {trajet.remorqueId?.immatriculation}
                    </td>
                    <td className="p-4">{trajet.lieuDepart}</td>
                    <td className="p-4">{trajet.lieuArrivee}</td>
                    <td className="p-4">{trajet.dateDepart}</td>
                    <td className="p-4">{trajet.dateArrivee}</td>
                    {/*<td className="p-4">{trajet.kmDepart || "-"}</td>
                    <td className="p-4">{trajet.kmArrivee || "-"}</td>
                    <td className="p-4">{trajet.volumeGasoil ?? "-"}</td> */}
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${
                          trajet.statut === "à_faire"
                            ? "bg-yellow-100 text-yellow-700"
                            : trajet.statut === "en_cours"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {trajet.statut}
                      </span>
                    </td>
                    {/* <td className="p-4">{trajet.remarque || "-"}</td> */}
                    <td className="p-4 flex justify-center gap-4">
                      <button
                        onClick={() => handleOpenModal(trajet)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteTrajet(trajet._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => navigate(`/trajet-details/${trajet._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}

                {trajets.length === 0 && (
                  <tr>
                    <td colSpan="13" className="p-6 text-center text-gray-500">
                      Aucun trajet trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* <TrajetModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTrajet}
          selectedTrajet={selectedTrajet}
        /> */}
      </main>
    </div>
  );
};

export default GestionTrajets;
