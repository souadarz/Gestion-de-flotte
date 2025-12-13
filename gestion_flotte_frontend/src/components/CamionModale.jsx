import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCamionById } from "../features/camionSlice";

const CamionModal = ({ isOpen, onClose, onSave, camionId }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    immatriculation: "",
    marque: "",
    modele: "",
    kilometrageActuel: "",
    statut: "Disponible",
  });
  const { camionDetail, loading, error } = useSelector(
    (state) => state.camions
  );

  // useEffect(() => {
  //   setFormData({
  //     immatriculation: "",
  //     marque: "",
  //     modele: "",
  //     kilometrageActuel: "",
  //     statut: "Disponible",
  //   });
  // });

  useEffect(() => {
    if (camionId) {
      dispatch(getCamionById(camionId));
    } else {
      setFormData({
        immatriculation: "",
        marque: "",
        modele: "",
        kilometrageActuel: "",
        statut: "Disponible",
      });
    }
  }, [dispatch, camionId]);

  useEffect(() => {
    if (camionId && camionDetail) {
      setFormData({
        immatriculation: camionDetail.immatriculation || "",
        marque: camionDetail.marque || "",
        modele: camionDetail.modele || "",
        kilometrage: camionDetail.kilometrage || "",
        statut: camionDetail.statut || "Disponible",
      });
    }
  }, [camionDetail, camionId]);

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

  if (loading) return <p>chargement...</p>;

  if (error) return <p>Erreur: {error}</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#002D74]">
            {camionId ? "Modifier le camion" : "Ajouter un camion"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="immatriculation"
              value={formData.immatriculation}
              onChange={handleChange}
              placeholder="Immatriculation"
              className="p-3 rounded-xl border w-full"
              required
            />
            <input
              name="marque"
              value={formData.marque}
              onChange={handleChange}
              placeholder="Marque"
              className="p-3 rounded-xl border w-full"
              required
            />
            <input
              name="modele"
              value={formData.modele}
              onChange={handleChange}
              placeholder="Modèle"
              className="p-3 rounded-xl border w-full"
              required
            />
            <input
              type="number"
              name="kilometrageActuel"
              value={formData.kilometrageActuel}
              onChange={handleChange}
              placeholder="Kilométrage"
              className="p-3 rounded-xl border w-full"
              required
            />
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="p-3 rounded-xl border w-full md:col-span-2"
            >
              <option>Disponible</option>
              <option>En mission</option>
              <option>Maintenance</option>
            </select>
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

export default CamionModal;
