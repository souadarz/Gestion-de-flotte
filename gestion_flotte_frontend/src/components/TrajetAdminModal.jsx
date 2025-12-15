import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllCamions } from "../features/camionSlice";
import { getAllChauffeurs } from "../features/chauffeurSlice";
import { getAllRemorques } from "../features/remorqueSlice";

const TrajetAdminModal = ({ isOpen, onClose, onSave, selectedTrajet }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    chauffeurId: "",
    camionId: "",
    remorqueId: "",
    lieuDepart: "",
    lieuArrivee: "",
    dateDepart: "",
    dateArrivee: "",
    remarque: "",
  });

  const { loadingDetail, error } = useSelector((state) => state.trajets);

  // filrage des camions selon le statu
  const camionsDisponibles = useSelector((state) =>
    state.camions.camions.filter((camion) => camion.statut === "disponible")
  );

  const chauffeurs = useSelector((state) => state.chauffeurs.chauffeurs);
  const remorques = useSelector((state) => state.remorques.remorques);

  useEffect(() => {
    dispatch(getAllCamions());
    dispatch(getAllChauffeurs());
    dispatch(getAllRemorques());
    if (selectedTrajet) {
      setFormData({
        chauffeurId: selectedTrajet.chauffeurId?._id || "",
        camionId: selectedTrajet.camionId?._id || "",
        remorqueId: selectedTrajet.remorqueId?._id || "",
        lieuDepart: selectedTrajet.lieuDepart || "",
        lieuArrivee: selectedTrajet.lieuArrivee || "",
        dateDepart: selectedTrajet.dateDepart?.slice(0, 10) || "",
        dateArrivee: selectedTrajet.dateArrivee?.slice(0, 10) || "",
        remarque: selectedTrajet.remarque || "",
      });
    }
  }, [selectedTrajet, dispatch]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (loadingDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) return <p>Erreur: {error}</p>;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002D74]">
            {selectedTrajet ? "Modifier le trajet" : "Créer un trajet"}
          </h2>
          <button onClick={onClose}>
            <FaTimes size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Affectations */}
          <div className="grid md:grid-cols-3 gap-4">
            <select
              name="chauffeurId"
              value={formData.chauffeurId}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Chauffeur</option>
              {chauffeurs.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.email}
                </option>
              ))}
            </select>

            <select
              name="camionId"
              value={formData.camionId}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="">Camion</option>
              {camionsDisponibles.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.immatriculation}
                </option>
              ))}
            </select>

            <select
              name="remorqueId"
              value={formData.remorqueId}
              onChange={handleChange}
              className="input"
            >
              <option value="">Remorque</option>
              {remorques.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.immatriculation}
                </option>
              ))}
            </select>
          </div>

          {/* Lieux */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="lieuDepart"
              value={formData.lieuDepart}
              onChange={handleChange}
              placeholder="Lieu de départ"
              className="input"
            />
            <input
              name="lieuArrivee"
              value={formData.lieuArrivee}
              onChange={handleChange}
              placeholder="Lieu d'arrivée"
              className="input"
            />
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="date"
              name="dateDepart"
              value={formData.dateDepart}
              onChange={handleChange}
              className="input"
            />
            <input
              type="date"
              name="dateArrivee"
              value={formData.dateArrivee}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrajetAdminModal;
