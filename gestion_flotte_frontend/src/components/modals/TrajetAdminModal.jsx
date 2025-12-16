import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaUser,
  FaTruck,
  FaTrailer,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStickyNote,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getAllCamions } from "../../features/camionSlice";
import { getAllChauffeurs } from "../../features/chauffeurSlice";
import { getAllRemorques } from "../../features/remorqueSlice";

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

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const { loadingDetail, error } = useSelector((state) => state.trajets);
  const camions = useSelector((state) => state.camions.camions);
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

  // Validation en temps réel
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "chauffeurId":
        if (!value) error = "Veuillez sélectionner un chauffeur";
        break;
      case "camionId":
        if (!value) error = "Veuillez sélectionner un camion";
        break;
      case "lieuDepart":
        if (!value.trim()) error = "Le lieu de départ est obligatoire";
        else if (value.trim().length < 3) error = "Minimum 3 caractères";
        break;
      case "lieuArrivee":
        if (!value.trim()) error = "Le lieu d'arrivée est obligatoire";
        else if (value.trim().length < 3) error = "Minimum 3 caractères";
        break;
      case "dateDepart":
        if (!value) error = "La date de départ est obligatoire";
        break;
      case "dateArrivee":
        if (!value) error = "La date d'arrivée est obligatoire";
        else if (formData.dateDepart && value < formData.dateDepart) {
          error = "La date d'arrivée doit être après le départ";
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));

    // Valider le champ modifié
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Si on change dateDepart, revalider dateArrivee
    if (name === "dateDepart" && formData.dateArrivee) {
      const arriveError =
        formData.dateArrivee < value
          ? "La date d'arrivée doit être après le départ"
          : "";
      setErrors((prev) => ({ ...prev, dateArrivee: arriveError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Valider tous les champs
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "remarque" && key !== "remorqueId") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    // Si pas d'erreurs, soumettre
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
    }
  };

  if (!isOpen) return null;

  if (loadingDetail) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md">
          <p className="text-red-600 font-semibold">Erreur: {error}</p>
          <button onClick={onClose} className="mt-4 btn-primary w-full">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header avec gradient */}
        <div className="bg-gradient-to-r from-[#002D74] to-[#0047AB] p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaTruck className="text-3xl" />
              {selectedTrajet ? "Modifier le trajet" : "Créer un trajet"}
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-all duration-300"
            >
              <FaTimes size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Section 1: Affectations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaUser className="text-[#002D74]" />
              Affectations
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Chauffeur */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Chauffeur <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="chauffeurId"
                    value={formData.chauffeurId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.chauffeurId && touched.chauffeurId
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  >
                    <option value="">Sélectionner un chauffeur</option>
                    {chauffeurs.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nom} - {c.email}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.chauffeurId && touched.chauffeurId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.chauffeurId}
                  </p>
                )}
              </div>

              {/* Camion */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Camion <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaTruck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="camionId"
                    value={formData.camionId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.camionId && touched.camionId
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  >
                    <option value="">Sélectionner un camion</option>
                    {camions.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.immatriculation} - {c.marque}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.camionId && touched.camionId && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.camionId}
                  </p>
                )}
              </div>

              {/* Remorque */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Remorque
                </label>
                <div className="relative">
                  <FaTrailer className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    name="remorqueId"
                    value={formData.remorqueId}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#002D74] focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                  >
                    <option value="">Sélectionner une remorque</option>
                    {remorques.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.immatriculation} - {r.type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Itinéraire */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaMapMarkerAlt className="text-[#002D74]" />
              Itinéraire
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Lieu de départ */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Lieu de départ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <input
                    name="lieuDepart"
                    value={formData.lieuDepart}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex: Paris, 75001"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.lieuDepart && touched.lieuDepart
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  />
                </div>
                {errors.lieuDepart && touched.lieuDepart && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.lieuDepart}
                  </p>
                )}
              </div>

              {/* Lieu d'arrivée */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Lieu d'arrivée <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500" />
                  <input
                    name="lieuArrivee"
                    value={formData.lieuArrivee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex: Lyon, 69001"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.lieuArrivee && touched.lieuArrivee
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  />
                </div>
                {errors.lieuArrivee && touched.lieuArrivee && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.lieuArrivee}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaCalendarAlt className="text-[#002D74]" />
              Planning
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Date de départ */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date de départ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="dateDepart"
                    value={formData.dateDepart}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.dateDepart && touched.dateDepart
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  />
                </div>
                {errors.dateDepart && touched.dateDepart && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.dateDepart}
                  </p>
                )}
              </div>

              {/* Date d'arrivée */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Date d'arrivée <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="dateArrivee"
                    value={formData.dateArrivee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.dateArrivee && touched.dateArrivee
                        ? "border-red-500 focus:border-red-600"
                        : "border-gray-300 focus:border-[#002D74]"
                    } focus:outline-none focus:ring-2 focus:ring-blue-200`}
                  />
                </div>
                {errors.dateArrivee && touched.dateArrivee && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span>⚠</span> {errors.dateArrivee}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Remarque */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <FaStickyNote className="text-[#002D74]" />
              Remarques (optionnel)
            </h3>
            <div className="relative">
              <textarea
                name="remarque"
                value={formData.remarque}
                onChange={handleChange}
                placeholder="Ajoutez des remarques ou instructions spécifiques..."
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#002D74] focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
              />
            </div>
          </div>

          {/* Footer avec boutons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300 hover:scale-105"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#002D74] to-[#0047AB] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {selectedTrajet ? "Mettre à jour" : "Créer le trajet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrajetAdminModal;
