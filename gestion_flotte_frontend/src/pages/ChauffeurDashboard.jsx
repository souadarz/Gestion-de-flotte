import React, { useEffect, useState } from "react";
import {
  FaRoute,
  FaFilePdf,
  FaCheckCircle,
  FaClock,
  FaPlayCircle,
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getTrajetsChauffeur, updateTrajetChauffeur } from "../features/trajetSlice.js";
import useAuth from "../hooks/useAuth.js";
import TrajetChauffeurModal from "../components/TrajetCauffeurModal.jsx";

const ChauffeurDashboard = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrajet, setSelectedTrajet] = useState("");

  // const { user } = useSelector((state) => state.auth);
  const { user } = useAuth()
  const { trajetsChauffeur } = useSelector((state) => state.trajets);

  const totalTrajets = trajetsChauffeur.length;
  const enCours = trajetsChauffeur.filter(t => t.statut === "en_cours").length;
  const termines = trajetsChauffeur.filter(t => t.statut === "terminé").length;

  useEffect(() => {
    // console.log("userId",user.id);
    if (user?.id) {
      dispatch(getTrajetsChauffeur(user.id));
    }
  }, [dispatch, user]);

  const openTrajetModal = (trajetId)=>{
    setIsModalOpen(true);
    setSelectedTrajet(trajetId)
  }

  const handleCloseModal = ()=>{
    setIsModalOpen(false);
  }

  const handleSaveTrajet = async (trajetData)=>{
    if(selectedTrajet?._id){
      await dispatch(updateTrajetChauffeur({id:selectedTrajet._id, data: trajetData} ));
    }
  }

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
                placeholder="Rechercher un trajet..."
                className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-[#206ab1]"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <FaBell className="text-2xl text-gray-600 cursor-pointer" />
            <FaUserCircle className="text-3xl text-gray-600 cursor-pointer" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              icon={<FaRoute />}
              title="Trajets assignés"
              value={totalTrajets}
              color="text-[#002D74]"
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

          {/* Table des trajets */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Mes Trajets</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th>Départ</th>
                  <th>Arrivée</th>
                  <th>Date départ</th>
                  <th>Date Arrivée</th>
                  <th>Camion</th>
                  <th>Remorque</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {trajetsChauffeur.map((trajet) => (
                  <tr key={trajet._id} className="border-b hover:bg-gray-50">
                    <td>{trajet.lieuDepart}</td>
                    <td>{trajet.lieuArrivee}</td>
                    <td>{trajet.dateDepart}</td>
                    <td>{trajet.dateArrivee}</td>
                    <td>{trajet.camionId?.immatriculation}</td>
                    <td>{trajet.remorqueId?.immatriculation}</td>
                    <td>{trajet.statut}</td>

                    {/* <td>
                      <select
                        value={trajet.status}
                        onChange={(e) =>
                          dispatch(updateTrajetStatus({
                            id: trajet._id,
                            status: e.target.value
                          }))
                        }
                        className="border rounded px-2 py-1"
                      >
                        <option value="à_faire">À faire</option>
                        <option value="en_cours">En cours</option>
                        <option value="terminé">Terminé</option>
                      </select>
                    </td> */}

                    <td className="flex gap-3 py-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Télécharger PDF"
                      >
                        <FaFilePdf />
                      </button>

                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Compléter trajet"
                        onClick={() => openTrajetModal(trajet._id)}
                      >
                        <FaClock />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
           <TrajetChauffeurModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveTrajet}
          selectedTrajet={selectedTrajet}
        />
        </main>
      </div>
    </div>
  );
};

export default ChauffeurDashboard;