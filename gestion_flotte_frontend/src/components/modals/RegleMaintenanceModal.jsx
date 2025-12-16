import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const RegleMaintenanceModal = ({ isOpen, onClose, onSave, selectedItem }) => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    periodiciteKm: "",
    periodiciteMois: "",
    seuilAlerteKm: "",
    seuilAlerteJours: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        type: selectedItem.type || "",
        description: selectedItem.description || "",
        periodiciteKm: selectedItem.periodiciteKm || "",
        periodiciteMois: selectedItem.periodiciteMois || "",
        seuilAlerteKm: selectedItem.seuilAlerteKm || "",
        seuilAlerteJours: selectedItem.seuilAlerteJours || "",
      });
    } else {
      setFormData({
        type: "",
        description: "",
        periodiciteKm: "",
        periodiciteMois: "",
        seuilAlerteKm: "",
        seuilAlerteJours: "",
      });
    }
    setErrors({});
  }, [selectedItem, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Gestion automatique des seuils d'alerte selon le type
    if (name === "type") {
      if (value === "vidange" || value === "pneus") {
        setFormData((prev) => ({ ...prev, seuilAlerteJours: "" }));
      } else if (value === "revision") {
        setFormData((prev) => ({ ...prev, seuilAlerteKm: "" }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = "Le type est obligatoire";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    if (!formData.periodiciteKm && !formData.periodiciteMois) {
      newErrors.periodicite = "Au moins une périodicité (Km ou Mois) doit être définie";
    }

    if (formData.type === "vidange" || formData.type === "pneus") {
      if (!formData.seuilAlerteKm) {
        newErrors.seuilAlerteKm = "Le seuil d'alerte en km est obligatoire pour ce type";
      }
    }

    if (formData.type === "revision") {
      if (!formData.seuilAlerteJours) {
        newErrors.seuilAlerteJours = "Le seuil d'alerte en jours est obligatoire pour ce type";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Nettoyer les données avant envoi
      const cleanedData = {
        type: formData.type,
        description: formData.description,
        periodiciteKm: formData.periodiciteKm ? Number(formData.periodiciteKm) : null,
        periodiciteMois: formData.periodiciteMois ? Number(formData.periodiciteMois) : null,
        seuilAlerteKm: formData.seuilAlerteKm ? Number(formData.seuilAlerteKm) : null,
        seuilAlerteJours: formData.seuilAlerteJours ? Number(formData.seuilAlerteJours) : null,
      };

      onSave(cleanedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedItem ? "Modifier la Règle" : "Ajouter une Règle"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type de maintenance */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type de Maintenance <span className="text-red-500">*</span>
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Sélectionner un type</option>
              <option value="vidange">Vidange</option>
              <option value="pneus">Pneus</option>
              <option value="revision">Révision</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Ex: Vidange moteur standard avec filtre à huile"
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Périodicités */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-blue-700 mb-3">
              Périodicité (au moins un champ requis)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Périodicité Km */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tous les (km)
                </label>
                <input
                  type="number"
                  name="periodiciteKm"
                  value={formData.periodiciteKm}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 10000"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002D74]"
                />
              </div>

              {/* Périodicité Mois */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tous les (mois)
                </label>
                <input
                  type="number"
                  name="periodiciteMois"
                  value={formData.periodiciteMois}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 12"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002D74]"
                />
              </div>
            </div>

            {errors.periodicite && (
              <p className="text-red-500 text-sm mt-2">{errors.periodicite}</p>
            )}
          </div>

          {/* Seuils d'alerte */}
          <div className="bg-amber-50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-amber-700 mb-3">
              Seuils d'Alerte
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Seuil Alerte Km (pour vidange et pneus) */}
              {(formData.type === "vidange" || formData.type === "pneus") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alerte avant (km) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="seuilAlerteKm"
                    value={formData.seuilAlerteKm}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ex: 500"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                      errors.seuilAlerteKm ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.seuilAlerteKm && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seuilAlerteKm}
                    </p>
                  )}
                </div>
              )}

              {/* Seuil Alerte Jours (pour révision) */}
              {formData.type === "revision" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alerte avant (jours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="seuilAlerteJours"
                    value={formData.seuilAlerteJours}
                    onChange={handleChange}
                    min="0"
                    placeholder="Ex: 7"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                      errors.seuilAlerteJours ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.seuilAlerteJours && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.seuilAlerteJours}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 duration-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#002D74] text-white rounded-xl font-semibold hover:bg-[#206ab1] duration-300"
            >
              {selectedItem ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegleMaintenanceModal;