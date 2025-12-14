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
  const { totalItems: totalTrajets, currentPage: trajetPage, limit: trajetLimit } = useSelector(
    (state) => state.trajets
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
              value={totalTrajets}
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

            {/*Statut de la flotte */}
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
          {/* </div> */}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
