import React from "react";
import {
  FaChartBar,
  FaExclamationTriangle,
  FaRoute,
  FaTachometerAlt,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import { useDispatch } from "react-redux";
import { logout } from "../features/authSlice.js";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      navigate("/login");
    }
  };
  return (
    <div className="w-64 bg-[#002D74] text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-blue-800">
        Fleet<span className="font-normal">Manager</span>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          {user?.role === "admin" && (
            <>
              <li className="mb-2">
                <Link
                  to="/adminDashboard"
                  className="flex items-center p-3 rounded-lg bg-[#206ab1] font-semibold"
                >
                  <FaChartBar className="mr-3" /> Tableau de Bord
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/camions"
                  className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
                >
                  <FaTruck className="mr-3" /> Gestion des camions
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/chauffeurs"
                  className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
                >
                  <FaUsers className="mr-3" /> Chauffeurs
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/trajets"
                  className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
                >
                  <FaRoute className="mr-3" /> Gestion des trajets
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/maintenance"
                  className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
                >
                  <FaExclamationTriangle className="mr-3" /> Gestion de
                  maintenace
                </Link>
              </li>
            </>
          )}
          {user?.role === "chauffeur" && (
            <>
              <li className="mb-2">
                <Link
                  to="/chauffeur/chauffeurDashbord"
                  className="flex items-center p-3 rounded-lg bg-[#206ab1] font-semibold"
                >
                  <FaChartBar className="mr-3" /> Tableau de Bord
                </Link>
              </li>
              <li className="mb-2">
                <Link
                  to="/chauffeur/MesTrajets"
                  className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
                >
                  <FaRoute className="mr-3" /> Mest trajets
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800">
        <button
          onClick={handleLogout}
          className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
        >
          <FiLogOut className="mr-3" /> Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
