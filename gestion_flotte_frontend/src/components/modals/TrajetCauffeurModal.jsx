import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const TrajetChauffeurModal = ({ isOpen, onClose, onSave, selectedTrajet }) => {
  const [formData, setFormData] = useState({
    kmDepart: "",
    kmArrivee: "",
    volumeGasoil: "",
    statut: "",
    remarque: "",
  });

  useEffect(() => {
    if (selectedTrajet) {
      setFormData({
        kmDepart: selectedTrajet.kmDepart || "",
        kmArrivee: selectedTrajet.kmArrivee || "",
        volumeGasoil: selectedTrajet.volumeGasoil || "",
        statut: selectedTrajet.statut || "en_cours",
        remarque: selectedTrajet.remarque || "",
      });
    } else {
      setFormData({
        kmDepart: "",
        kmArrivee: "",
        volumeGasoil: "",
        statut: "en_cours",
        remarque: "",
      });
    }
  }, [selectedTrajet]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002D74]">
            Mise à jour du trajet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              name="kmDepart"
              value={formData.kmDepart}
              onChange={handleChange}
              placeholder="Kilométrage départ"
              className="p-3 rounded-xl border w-full"
              required
            />

            <input
              type="number"
              name="kmArrivee"
              value={formData.kmArrivee}
              onChange={handleChange}
              placeholder="Kilométrage arrivée"
              className="p-3 rounded-xl border w-full"
            />

            <input
              type="number"
              name="volumeGasoil"
              value={formData.volumeGasoil}
              onChange={handleChange}
              placeholder="Volume gasoil (L)"
              className="p-3 rounded-xl border w-full"
            />

            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="p-3 rounded-xl border w-full"
              required
            >
              <option value="en_cours">En cours</option>
              <option value="terminé">Terminé</option>
            </select>

            <textarea
              name="remarque"
              value={formData.remarque}
              onChange={handleChange}
              placeholder="Remarque"
              className="p-3 rounded-xl border w-full md:col-span-2 h-24 resize-none"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-xl font-semibold hover:bg-gray-300 duration-300"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-[#002D74] text-white py-2 px-6 rounded-xl font-semibold hover:scale-105 duration-300"
            >
              Valider
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrajetChauffeurModal;