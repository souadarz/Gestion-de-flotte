import Camion from "../models/Camion.js";

export const createCamion = async (req, res, next) => {
  try {
    const {
      immatriculation,
      marque,
      modele,
      annee,
      kilometrageActuel,
      statut,
      kmDerniereVidange,
    } = req.body;

    const camionExistant = await Camion.findOne({
      immatriculation,
    });

    if (camionExistant) {
      return res.status(400).json({
        success: false,
        message: "un camion avec cette immatriculation existe deja",
      });
    }

    const camion = await Camion.create({
      immatriculation,
      marque,
      modele,
      annee,
      kilometrageActuel,
      kmDerniereVidange,
    });

    res.status(201).json({
      success: true,
      message: "camion créé avec succés",
      data: camion,
    });
  } catch (error) {
    next(error);
  }
};

//recuperation de tout les camions
export const getAllCamions = async (req, res, next) => {
  try {
    const { page = 1, pages, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const camions = await Camion.find()
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Camion.countDocuments();

    res.status(200).json({
      success: true,
      message: "Camions récupérés avec succès",
      metaData: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        count: camions.length,
      },
      data: camions,
    });
  } catch (error) {
    next(error);
  }
};

export const getCamionById = async (req, res, next) => {
  try {
    const camion = await Camion.findById(req.params.id);

    if (!camion) {
      return res.status(404).Json({
        success: false,
        message: "camion non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "camion récupéré avec succès",
      data: camion,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCamion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const camion = await Camion.findById(id);
    if (!camion) {
      return res.status(404).json({
        success: false,
        message: "Camion non trouvé",
      });
    }

    const updatedCamion = await Camion.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true, 
    });

    res.status(200).json({
      success: true,
      message: "Camion mis à jour avec succès",
      data: updatedCamion,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCamion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const camion = await Camion.findById(id);
    if (!camion) {
      return res.status(404).json({
        success: false,
        message: "Camion non trouvé",
      });
    }

    const deletedCamion = await Camion.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Camion supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
