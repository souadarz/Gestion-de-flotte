import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const MaintenanceModal = ({ isOpen, onClose, onSave, selectedMaintenance, camions, remorques, regles }) => {
  const [formData, setFormData] = useState({
    vehiculeType: "",
    vehiculeId: "",
    regleMaintenanceId: "",
    type: "",
    dateMaintenance: "",
    kilometrageRealisation: "",
    cout: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [vehiculesDisponibles, setVehiculesDisponibles] = useState([]);

  useEffect(() => {
    if (selectedMaintenance) {
      setFormData({
        vehiculeType: selectedMaintenance.vehiculeType || "",
        vehiculeId: selectedMaintenance.vehiculeId?._id || "",
        regleMaintenanceId: selectedMaintenance.regleMaintenanceId?._id || "",
        type: selectedMaintenance.type || "",
        dateMaintenance: selectedMaintenance.dateMaintenance?.split("T")[0] || "",
        kilometrageRealisation: selectedMaintenance.kilometrageRealisation || "",
        cout: selectedMaintenance.cout || "",
        description: selectedMaintenance.description || "",
      });
    } else {
      setFormData({
        vehiculeType: "",
        vehiculeId: "",
        regleMaintenanceId: "",
        type: "",
        dateMaintenance: "",
        kilometrageRealisation: "",
        cout: "",
        description: "",
      });
    }
    setErrors({});
  }, [selectedMaintenance, isOpen]);

  useEffect(() => {
    if (formData.vehiculeType === "camion") {
      setVehiculesDisponibles(camions || []);
    } else if (formData.vehiculeType === "remorque") {
      setVehiculesDisponibles(remorques || []);
    } else {
      setVehiculesDisponibles([]);
    }
  }, [formData.vehiculeType, camions, remorques]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }

    // Réinitialiser vehiculeId si on change le type
    if (name === "vehiculeType") {
      setFormData((prev) => ({ ...prev, vehiculeId: "" }));
    }
    
    if (name === "regleMaintenanceId") {
      const regleSelectionnee = regles?.find((r) => r._id === value);
      if (regleSelectionnee) {
        setFormData((prev) => ({ ...prev, type: regleSelectionnee.type }));
      }
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.vehiculeType) {
      newErrors.vehiculeType = "Le type de véhicule est obligatoire";
    }

    if (!formData.vehiculeId) {
      newErrors.vehiculeId = "Le véhicule est obligatoire";
    }

    if (!formData.regleMaintenanceId) {
      newErrors.regleMaintenanceId = "La règle de maintenance est obligatoire";
    }

    if (!formData.type) {
      newErrors.type = "Le type est obligatoire";
    }

    if (!formData.dateMaintenance) {
      newErrors.dateMaintenance = "La date est obligatoire";
    }

    if (!formData.kilometrageRealisation) {
      newErrors.kilometrageRealisation = "Le kilométrage est obligatoire";
    }

    if (!formData.description?.trim()) {
      newErrors.description = "La description est obligatoire";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const cleanedData = {
        vehiculeType: formData.vehiculeType,
        vehiculeId: formData.vehiculeId,
        regleMaintenanceId: formData.regleMaintenanceId,
        type: formData.type,
        dateMaintenance: formData.dateMaintenance,
        kilometrageRealisation: Number(formData.kilometrageRealisation),
        cout: formData.cout ? Number(formData.cout) : 0,
        description: formData.description,
      };

      onSave(cleanedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedMaintenance ? "Modifier la Maintenance" : "Ajouter une Maintenance"}
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
          {/* Section Véhicule */}
          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-blue-700 mb-3">
              Informations du Véhicule
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type de véhicule */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de Véhicule <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehiculeType"
                  value={formData.vehiculeType}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                    errors.vehiculeType ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionner</option>
                  <option value="camion">Camion</option>
                  <option value="remorque">Remorque</option>
                </select>
                {errors.vehiculeType && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehiculeType}</p>
                )}
              </div>

              {/* Véhicule */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Véhicule <span className="text-red-500">*</span>
                </label>
                <select
                  name="vehiculeId"
                  value={formData.vehiculeId}
                  onChange={handleChange}
                  disabled={!formData.vehiculeType}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                    errors.vehiculeId ? "border-red-500" : "border-gray-300"
                  } ${!formData.vehiculeType ? "bg-gray-100" : ""}`}
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehiculesDisponibles.map((vehicule) => (
                    <option key={vehicule._id} value={vehicule._id}>
                      {vehicule.immatriculation} - {vehicule.marque || vehicule.type}
                    </option>
                  ))}
                </select>
                {errors.vehiculeId && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehiculeId}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section Maintenance */}
          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm font-semibold text-purple-700 mb-3">
              Détails de la Maintenance
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Règle de maintenance */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Règle de Maintenance <span className="text-red-500">*</span>
                </label>
                <select
                  name="regleMaintenanceId"
                  value={formData.regleMaintenanceId}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                    errors.regleMaintenanceId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Sélectionner une règle</option>
                  {regles?.map((regle) => (
                    <option key={regle._id} value={regle._id}>
                      {regle.type} - {regle.description}
                    </option>
                  ))}
                </select>
                {errors.regleMaintenanceId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.regleMaintenanceId}
                  </p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100"
                />
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>

              {/* Date de maintenance */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de Maintenance <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateMaintenance"
                  value={formData.dateMaintenance}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                    errors.dateMaintenance ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.dateMaintenance && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dateMaintenance}
                  </p>
                )}
              </div>

              {/* Kilométrage */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kilométrage <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="kilometrageRealisation"
                  value={formData.kilometrageRealisation}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 45000"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                    errors.kilometrageRealisation ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.kilometrageRealisation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.kilometrageRealisation}
                  </p>
                )}
              </div>

              {/* Coût */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coût (MAD)
                </label>
                <input
                  type="number"
                  name="cout"
                  value={formData.cout}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 500"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#002D74]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Ex: Vidange moteur + remplacement filtre à huile et filtre à air"
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#002D74] ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
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
              {selectedMaintenance ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;