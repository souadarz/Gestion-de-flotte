import React, { useEffect } from "react";
import {
  FaTruck,
  FaRoute,
  FaUsers,
  FaExclamationTriangle,
  FaPlus,
  FaSearch,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import { useDispatch, useSelector } from "react-redux";
import { getAllCamions } from "../features/camionSlice";
import { getAllChauffeurs } from "../features/chauffeurSlice.js";
// import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
    const { totalItems: totalCamions, currentPage: camionPage, limit: camionLimit } = useSelector(
    (state) => state.camions
  );
  const { totalItems: totalChauffeurs, currentPage: chauffeurPage, limit: chauffeurLimit } = useSelector(
    (state) => state.chauffeurs
  );

  useEffect(() => {
    dispatch(getAllCamions({ page: camionPage, limit: camionLimit }));
    dispatch(getAllChauffeurs({ page: chauffeurPage, limit: chauffeurLimit }));
    // console.log("chauuuuu", totalChauffeurs);
  }, [dispatch, camionPage, camionLimit, chauffeurPage, chauffeurLimit]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#206ab1]"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <FaBell className="text-2xl text-gray-600 hover:text-[#002D74] cursor-pointer" />
            <FaUserCircle className="text-3xl text-gray-600 hover:text-[#002D74] cursor-pointer" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {/* Grille de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={<FaTruck />}
              title="Camions au total"
              value={totalCamions}
              color="text-[#002D74]"
            />
            <StatCard
              icon={<FaRoute />}
              title="Trajets en cours"
              value="12"
              color="text-green-500"
            />
            <StatCard
              icon={<FaUsers />}
              title="Chauffeurs disponibles"
              value={totalChauffeurs}
              color="text-blue-500"
            />
            <StatCard
              icon={<FaExclamationTriangle />}
              title="Alertes Maintenance"
              value="3"
              color="text-amber-500"
            />
          </div>

          {/* actions rapides et tableau */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de gauche : Trajets récents */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Trajets Récents
                </h2>
                <button className="bg-[#002D74] text-white py-2 px-5 rounded-xl font-semibold hover:scale-105 duration-300 flex items-center">
                  <FaPlus className="mr-2" /> Nouveau Trajet
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Chauffeur</th>
                      <th className="py-2">Origine</th>
                      <th className="py-2">Destination</th>
                      <th className="py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Jean Dupont</td>
                      <td className="py-3">Entrepôt A</td>
                      <td className="py-3">Client X</td>
                      <td className="py-3">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                          Terminé
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Marie Curie</td>
                      <td className="py-3">Port de Marseille</td>
                      <td className="py-3">Entrepôt B</td>
                      <td className="py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                          En cours
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-3">Pierre Martin</td>
                      <td className="py-3">Fournisseur Y</td>
                      <td className="py-3">Entrepôt A</td>
                      <td className="py-3">
                        <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">
                          À faire
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3">Sophie Lemoine</td>
                      <td className="py-3">Entrepôt B</td>
                      <td className="py-3">Client Z</td>
                      <td className="py-3">
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                          Problème
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Colonne de droite : Statut de la flotte */}
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                État de la Flotte
              </h2>
              <div className="text-center text-gray-500">
                <p className="font-bold text-lg">Graphique de la flotte</p>
                <div className="relative w-48 h-48 mx-auto my-4">
                  <div
                    className="absolute inset-0 rounded-full bg-green-300"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full bg-blue-300"
                    style={{
                      transform: "rotate(180deg)",
                      clipPath: "polygon(50% 0%, 100% 0, 100% 60%, 50% 60%)",
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 rounded-full bg-amber-300"
                    style={{
                      transform: "rotate(288deg)",
                      clipPath: "polygon(50% 0, 100% 0, 100% 30%, 50% 30%)",
                    }}
                  ></div>
                  <div className="absolute inset-2/4 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">42</span>
                  </div>
                </div>
                <div className="flex justify-around text-sm">
                  <p>
                    <span className="font-bold text-green-600">■</span> En
                    trajet
                  </p>
                  <p>
                    <span className="font-bold text-blue-600">■</span>{" "}
                    Disponible
                  </p>
                  <p>
                    <span className="font-bold text-amber-600">■</span>{" "}
                    Maintenance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
