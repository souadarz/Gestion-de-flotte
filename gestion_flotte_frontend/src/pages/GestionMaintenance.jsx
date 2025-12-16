import React, { useEffect, useState } from "react";
import {
  FaWrench,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCog,
  FaHistory,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaTachometerAlt,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import MaintenanceModal from "../components/modals/MaintenanceModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createMaintenance,
  deleteMaintenance,
  getAllMaintenances,
  updateMaintenance,
} from "../features/maintenanceSlice.js";
import { getAllCamions } from "../features/camionSlice.js";
import { getAllRemorques } from "../features/remorqueSlice.js";
import RegleMaintenanceModal from "../components/modals/RegleMaintenanceModal.jsx";
import {
  createRegleMaintenance,
  deleteRegleMaintenance,
  getAllRegleMaintenance,
  updateRegleMaintenance,
} from "../features/regleMaintenanceSlice.js";

const GestionMaintenance = () => {
  const dispatch = useDispatch();
  const regles = useSelector((state) => state.regleMaintenances.regles);
  const maintenances = useSelector((state) => state.maintenances.maintenances);
  console.log("maintenance", maintenances);
  const [activeTab, setActiveTab] = useState("regles");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");

  //   const [regles, setRegles] = useState([]);
  //     {
  //       _id: "1",
  //       type: "vidange",
  //       description: "Vidange moteur standard",
  //       periodiciteKm: 10000,
  //       periodiciteMois: 12,
  //       seuilAlerteKm: 500,
  //     },
  //     {
  //       _id: "2",
  //       type: "pneus",
  //       description: "Vérification et rotation des pneus",
  //       periodiciteKm: 15000,
  //       periodiciteMois: null,
  //       seuilAlerteKm: 1000,
  //     },
  //     {
  //       _id: "3",
  //       type: "revision",
  //       description: "Révision complète annuelle",
  //       periodiciteKm: null,
  //       periodiciteMois: 12,
  //       seuilAlerteJours: 7,
  //     },
  //   ]);

  // États pour les maintenances
  //   const [maintenances, setMaintenances] = useState([]);
  //     {
  //       _id: "1",
  //       vehiculeType: "camion",
  //       vehiculeImmatriculation: "ABC-123",
  //       type: "vidange",
  //       dateMaintenance: "2024-12-10",
  //       kilometrageRealisation: 45000,
  //       cout: 250,
  //       description: "Vidange + remplacement filtre à huile",
  //     },
  //     {
  //       _id: "2",
  //       vehiculeType: "camion",
  //       vehiculeImmatriculation: "XYZ-789",
  //       type: "pneus",
  //       dateMaintenance: "2024-12-05",
  //       kilometrageRealisation: 62000,
  //       cout: 800,
  //       description: "Remplacement 2 pneus avant",
  //     },
  //     {
  //       _id: "3",
  //       vehiculeType: "remorque",
  //       vehiculeImmatriculation: "REM-456",
  //       type: "revision",
  //       dateMaintenance: "2024-11-28",
  //       kilometrageRealisation: 30000,
  //       cout: 450,
  //       description: "Révision complète + contrôle freinage",
  //     },
  //   ]);

  const handleOpenModal = (item = null, type = "") => {
    setSelectedItem(item);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalType("");
  };

  const handleDeleteRegle = (selectedItem) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette règle ?")) {
      dispatch(deleteRegleMaintenance(selectedItem));
      dispatch(getAllRegleMaintenance());
    }
  };

  const handleDeleteMaintenance = (selectedItem) => {
    try {
      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette maintenance ?")
      ) {
        dispatch(deleteMaintenance(selectedItem));
        dispatch(getAllMaintenances());
      }
    } catch (error) {
        console.error("Erreur suppression maintenance :", error);
    }
  };

  const handleSaveMaitenance = async (data) => {
    try {
      if (selectedItem?.id) {
        await dispatch(updateMaintenance({ id: selectedItem.id, data: data }));
      } else {
        await dispatch(createMaintenance(data));
      }
      dispatch(getAllMaintenances());
      handleCloseModal();
    } catch (error) {
      console.error("Erreur création ou modification maintenance :", error);
    }
  };

  const handleSaveRegleMaitenance = async (data) => {
    try {
      if (selectedItem?.id) {
        await dispatch(
          updateRegleMaintenance({ id: selectedItem.id, data: data })
        );
      } else {
        await dispatch(createRegleMaintenance(data));
      }
      dispatch(getAllRegleMaintenance());
      handleCloseModal();
    } catch (error) {
      console.error(
        "Erreur création ou modification du regle de maintenance :",
        error
      );
    }
  };

  useEffect(() => {
    dispatch(getAllCamions());
    dispatch(getAllRemorques());
    dispatch(getAllRegleMaintenance());
    dispatch(getAllMaintenances());
  }, [dispatch]);

  const getTypeBadge = (type) => {
    const badges = {
      vidange: "bg-blue-100 text-blue-700",
      pneus: "bg-amber-100 text-amber-700",
      revision: "bg-purple-100 text-purple-700",
    };
    return badges[type] || "bg-gray-100 text-gray-700";
  };

  const getVehiculeTypeBadge = (type) => {
    return type === "camion"
      ? "bg-green-100 text-green-700"
      : "bg-cyan-100 text-cyan-700";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaWrench className="mr-3 text-[#002D74]" />
              Gestion de la Maintenance
            </h1>
            <p className="text-gray-600 mt-1">
              Configurez les règles et suivez l'historique des maintenances
            </p>
          </div>
        </div>

        {/* Onglets */}
        <div className="bg-white rounded-t-2xl shadow-md">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("regles")}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 flex items-center justify-center ${
                activeTab === "regles"
                  ? "bg-[#002D74] text-white rounded-tl-2xl"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaCog className="mr-2" />
              Règles de Maintenance
            </button>
            <button
              onClick={() => setActiveTab("maintenances")}
              className={`flex-1 py-4 px-6 font-semibold text-center transition-all duration-300 flex items-center justify-center ${
                activeTab === "maintenances"
                  ? "bg-[#002D74] text-white rounded-tr-2xl"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FaHistory className="mr-2" />
              Historique des Maintenances
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            {activeTab === "regles" ? (
              <div>
                {/* Bouton d'ajout */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => handleOpenModal(null, "regle")}
                    className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center"
                  >
                    <FaPlus className="mr-2" /> Ajouter une Règle
                  </button>
                </div>

                {/* Tableau des règles */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold">Périodicité Km</th>
                        <th className="p-4 font-semibold">Périodicité Mois</th>
                        <th className="p-4 font-semibold">Seuil Alerte</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regles.map((regle) => (
                        <tr
                          key={regle._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${getTypeBadge(
                                regle.type
                              )}`}
                            >
                              {regle.type}
                            </span>
                          </td>
                          <td className="p-4">{regle.description}</td>
                          <td className="p-4">
                            {regle.periodiciteKm ? (
                              <span className="flex items-center text-gray-700">
                                <FaTachometerAlt className="mr-2 text-blue-500" />
                                {regle.periodiciteKm.toLocaleString()} km
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {regle.periodiciteMois ? (
                              <span className="flex items-center text-gray-700">
                                <FaCalendarAlt className="mr-2 text-purple-500" />
                                {regle.periodiciteMois} mois
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-4">
                            {regle.seuilAlerteKm && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                <FaExclamationTriangle className="inline mr-1" />
                                {regle.seuilAlerteKm} km
                              </span>
                            )}
                            {regle.seuilAlerteJours && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                <FaExclamationTriangle className="inline mr-1" />
                                {regle.seuilAlerteJours} jours
                              </span>
                            )}
                          </td>
                          <td className="p-4 flex items-center space-x-4">
                            <button
                              onClick={() => handleOpenModal(regle, "regle")}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteRegle(regle._id)}
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
            ) : (
              <div>
                {/* Bouton d'ajout */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => handleOpenModal(null, "maintenance")}
                    className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center"
                  >
                    <FaPlus className="mr-2" /> Ajouter une Maintenance
                  </button>
                </div>

                {/* Tableau des maintenances */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="p-4 font-semibold">Véhicule</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Date</th>
                        <th className="p-4 font-semibold">Kilométrage</th>
                        <th className="p-4 font-semibold">Coût</th>
                        <th className="p-4 font-semibold">Description</th>
                        <th className="p-4 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenances.map((maintenance) => (
                        <tr
                          key={maintenance._id}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div>
                              <span className="font-bold text-gray-700">
                                {maintenance.vehiculeImmatriculation}
                              </span>
                              <span
                                className={`ml-2 text-xs font-bold px-2 py-1 rounded ${getVehiculeTypeBadge(
                                  maintenance.vehiculeType
                                )}`}
                              >
                                {maintenance.vehiculeType}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full ${getTypeBadge(
                                maintenance.type
                              )}`}
                            >
                              {maintenance.type}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(
                              maintenance.dateMaintenance
                            ).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="p-4">
                            {maintenance.kilometrageRealisation.toLocaleString()}{" "}
                            km
                          </td>
                          <td className="p-4 font-bold text-green-600">
                            {maintenance.cout} MAD
                          </td>
                          <td className="p-4 text-gray-600 text-sm">
                            {maintenance.description}
                          </td>
                          <td className="p-4 flex items-center space-x-4">
                            <button
                              onClick={() =>
                                handleOpenModal(maintenance, "maintenance")
                              }
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteMaintenance(maintenance._id)
                              }
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

                {/* Statistiques rapides */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <p className="text-sm text-blue-600 font-semibold">
                      Coût Total
                    </p>
                    <p className="text-2xl font-bold text-blue-700">
                      {maintenances
                        .reduce((sum, m) => sum + m.cout, 0)
                        .toLocaleString()}{" "}
                      MAD
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-green-600 font-semibold">
                      Maintenances ce mois
                    </p>
                    <p className="text-2xl font-bold text-green-700">
                      {maintenances.length}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <p className="text-sm text-purple-600 font-semibold">
                      Coût Moyen
                    </p>
                    <p className="text-2xl font-bold text-purple-700">
                      {Math.round(
                        maintenances.reduce((sum, m) => sum + m.cout, 0) /
                          maintenances.length
                      ).toLocaleString()}{" "}
                      MAD
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {modalType === "maintenance" && (
          <MaintenanceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveMaitenance}
            selectedItem={selectedItem}
          />
        )}

        {modalType === "regle" && (
          <RegleMaintenanceModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveRegleMaitenance}
            selectedItem={selectedItem}
          />
        )}
      </main>
    </div>
  );
};

export default GestionMaintenance;
