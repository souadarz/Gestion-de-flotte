import React from "react";
import {
  FaExclamationTriangle,
  FaRoute,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Sidebar = () => {
  const { user } = useAuth();
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
                  <FaRoute className="mr-3" /> Tableau de Bord
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
            </>
          )}
          <li className="mb-2">
            <Link
              to=""
              className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
            >
              <FaExclamationTriangle className="mr-3" /> Maintenance
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-blue-800">
        <Link
          to=""
          className="flex items-center p-3 rounded-lg hover:bg-[#206ab1] transition-colors"
        >
          <FiLogOut className="mr-3" /> Déconnexion
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
