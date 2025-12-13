import React, { useEffect, useState } from "react";
import { FaTruck, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createCamion,
  deleteCamion,
  getAllCamions,
  updateCamion,
} from "../features/camionSlice.js";
import CamionModal from "../components/camionModale.jsx";

const GestionCamions = () => {
  const dispatch = useDispatch();
  const { camions, loading, error, currentPage, totalPages, limit } =
    useSelector((state) => state.camions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCamion, setSelectedCamion] = useState(null);

  useEffect(() => {
    dispatch(getAllCamions({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const handleOpenModal = (camion = null) => {
    console.log("camioncamioncamioncamion", camion);
    setSelectedCamion(camion);

    if (camion === null) {
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    if (selectedCamion !== null) {
      console.log("aaaaaaaaaa", selectedCamion);
      setIsModalOpen(true);
    }
  }, [selectedCamion]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCamion(null);
  };

  const handleSaveCamion = async (camionData) => {
    try {
      if (selectedCamion?._id) {
        await dispatch(
          updateCamion({
            id: selectedCamion._id,
            data: camionData,
          })
        ).unwrap();
      } else {
        await dispatch(createCamion(camionData)).unwrap();
      }

      dispatch(getAllCamions({ page: currentPage, limit }));
      handleCloseModal();
    } catch (error) {
      console.error("Erreur sauvegarde camion :", error);
    }
  };

  const handleDeleteCamion = async (id) => {
    try {
      if (window.confirm("Êtes-vous sûr de vouloir supprimer ce camion ?")) {
        await dispatch(deleteCamion(id)).unwrap();
        dispatch(getAllCamions({ page: currentPage, limit }));
      }
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Disponible":
        return "bg-green-100 text-green-700";
      case "En mission":
        return "bg-blue-100 text-blue-700";
      case "Maintenance":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* //   <div className="flex-1 flex flex-col">
         <Header /> */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Gestion des Camions
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center"
          >
            <FaPlus className="mr-2" /> Ajouter un Camion
          </button>
        </div>

        {/* camions */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-4 font-semibold">Immatriculation</th>
                  <th className="p-4 font-semibold">Marque & Modèle</th>
                  <th className="p-4 font-semibold">Kilométrage</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {camions.map((camion) => (
                  <tr key={camion._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-bold text-gray-700">
                      {camion.immatriculation}
                    </td>
                    <td className="p-4">
                      {camion.marque} {camion.modele}
                    </td>
                    <td className="p-4">
                      {camion.kilometrageActuel.toLocaleString()} km
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusBadge(
                          camion.statut
                        )}`}
                      >
                        {camion.statut}
                      </span>
                    </td>
                    <td className="p-4 flex items-center space-x-4">
                      <button
                        onClick={() => handleOpenModal(camion)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteCamion(camion._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <CamionModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCamion}
          selectedCamion={selectedCamion}
        />
      </main>
      //{" "}
    </div>
    // </div>
  );
};

export default GestionCamions;
