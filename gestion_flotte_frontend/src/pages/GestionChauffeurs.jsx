import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createChauffeur,
  getAllChauffeurs,
} from "../features/chauffeurSlice.js";
import ChauffeurModal from "../components/modals/chauffeurModale.jsx";

const GestionChauffeurs = () => {
  const dispatch = useDispatch();

  const { chauffeurs, loading, error } =
    useSelector((state) => state.chauffeurs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChauffeur, setSelectedChauffeur] = useState(null);

  useEffect(() => {
    dispatch(getAllChauffeurs());
  }, [dispatch]);

  const handleOpenModal = (chauffeur = null) => {
    setSelectedChauffeur(chauffeur);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedChauffeur(null);
  };

  const handleSaveChauffeur = async (chauffeurData) => {
    try {
      await dispatch(createChauffeur(chauffeurData)).unwrap();
      dispatch(getAllChauffeurs());
      handleCloseModal();
    } catch (err) {
      console.error("Erreur création chauffeur :", err);
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
            Gestion des Chauffeurs
          </h1>

          <button
            onClick={() => handleOpenModal()}
            className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold flex items-center hover:scale-105 duration-300"
          >
            <FaPlus className="mr-2" /> Ajouter un Chauffeur
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 font-semibold">Nom</th>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Rôle</th>
                  <th className="p-4 font-semibold">Créé le</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {chauffeurs.map((chauffeur) => (
                  <tr key={chauffeur._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{chauffeur.nom}</td>
                    <td className="p-4">{chauffeur.email}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                        {chauffeur.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(chauffeur.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex justify-center gap-4">
                      {/* <button
                        onClick={() => handleOpenModal(chauffeur)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button> */}
                      {/* <button
                        onClick={() => handleDeleteChauffeur(chauffeur._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button> */}
                    </td>
                  </tr>
                ))}

                {chauffeurs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500">
                      Aucun chauffeur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <ChauffeurModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveChauffeur}
          selectedChauffeur={selectedChauffeur}
        />
      </main>
    </div>
  );
};

export default GestionChauffeurs;
