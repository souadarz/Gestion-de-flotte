import React, { useEffect } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import { getTrajetById } from "../../features/trajetSlice.js";

const TrajetDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trajetDetail, loading, error } = useSelector(
    (state) => state.trajets
  );

  useEffect(() => {
    dispatch(getTrajetById(id));
  }, [dispatch, id]);

  if (loading) return <p className="p-6">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">Erreur : {error}</p>;
  if (!trajetDetail) return <p className="p-6">Trajet introuvable</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-2" /> Retour
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Détails du trajet
          </h1>
        </div>

        {/* Statut */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Statut du trajet</h2>
          <span
            className={`px-4 py-1 rounded-full text-sm font-bold
              ${
                trajetDetail.statut === "à_faire"
                  ? "bg-yellow-100 text-yellow-700"
                  : trajetDetail.statut === "en_cours"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-green-100 text-green-700"
              }`}
          >
            {trajetDetail.statut}
          </span>
        </div>

        {/* Chauffeur / Véhicules */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Chauffeur & véhicules
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Chauffeur</p>
              <p className="font-medium">
                {trajetDetail.chauffeurId?.nom}
              </p>
              <p className="text-sm text-gray-600">
                {trajetDetail.chauffeurId?.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Camion</p>
              <p className="font-medium">
                {trajetDetail.camionId?.immatriculation}
              </p>
              <p className="text-sm text-gray-600">
                {trajetDetail.camionId?.marque}{" "}
                {trajetDetail.camionId?.modele}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Remorque</p>
              <p className="font-medium">
                {trajetDetail.remorqueId?.immatriculation}
              </p>
              <p className="text-sm text-gray-600">
                {trajetDetail.remorqueId?.type}
              </p>
            </div>
          </div>
        </div>

        {/* Lieux & dates */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Lieux & planification
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Lieu de départ</p>
              <p className="font-medium">{trajetDetail.lieuDepart}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Lieu d'arrivée</p>
              <p className="font-medium">{trajetDetail.lieuArrivee}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date de départ</p>
              <p className="font-medium">{trajetDetail.dateDepart}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date d'arrivée</p>
              <p className="font-medium">{trajetDetail.dateArrivee}</p>
            </div>
          </div>
        </div>

        {/* Données chauffeur */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Données de conduite
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500">Km départ</p>
              <p className="font-medium">
                {trajetDetail.kmDepart ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Km arrivée</p>
              <p className="font-medium">
                {trajetDetail.kmArrivee ?? "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Volume gasoil</p>
              <p className="font-medium">
                {trajetDetail.volumeGasoil ?? "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Remarque */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Remarque</h2>
          <p className="text-gray-700">
            {trajetDetail.remarque || "Aucune remarque"}
          </p>
        </div>
      </main>
    </div>
  );
};

export default TrajetDetails;