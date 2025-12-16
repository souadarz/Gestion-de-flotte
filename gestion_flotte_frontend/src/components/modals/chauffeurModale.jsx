import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const ChauffeurModal = ({
  isOpen,
  onClose,
  onSave,
  selectedChauffeur,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
  });

  const { loading } = useSelector((state) => state.chauffeurs);

  useEffect(() => {
    if (selectedChauffeur) {
      setFormData({
        nom: selectedChauffeur.nom || "",
        email: selectedChauffeur.email || "",
      });
    } else {
      setFormData({
        nom: "",
        email: "",
      });
    }
  }, [selectedChauffeur]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002D74]">
            {selectedChauffeur
              ? "Modifier le chauffeur"
              : "Ajouter un chauffeur"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={22} />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center mb-4 text-gray-500">
            Chargement...
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              placeholder="Nom du chauffeur"
              className="p-3 rounded-xl border w-full"
              required
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email du chauffeur"
              className="p-3 rounded-xl border w-full"
              required
            />
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 py-2 px-6 rounded-xl font-semibold hover:bg-gray-300 duration-300"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="bg-[#002D74] text-white py-2 px-6 rounded-xl font-semibold hover:scale-105 duration-300"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChauffeurModal;
