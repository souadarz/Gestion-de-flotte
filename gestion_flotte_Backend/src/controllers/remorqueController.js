import Remorque from "../models/Remorque.js";

export const createRemorque = async (req, res, next) => {
  try {
    const { immatriculation, type, statut } = req.body;

    const remorqueExistant = await Remorque.findOne({
      immatriculation,
    });

    if (remorqueExistant) {
      return res.status(400).json({
        success: false,
        message: "un remorque avec cette immatriculation existe deja",
      });
    }

    const remorque = await Remorque.create({
      immatriculation,
      type,
      statut,
    });

    res.status(201).json({
      success: true,
      message: "remorque créé avec succés",
      data: remorque,
    });
  } catch (error) {
    next(error);
  }
};

//recuperation de tout les remorques
export const getAllRemorques = async (req, res, next) => {
  try {
    const { page = 1, pages, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const remorques = await Remorque.find()
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Remorque.countDocuments();

    res.status(200).json({
      success: true,
      message: "remorques récupérés avec succès",
      metaData: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        count: remorques.length,
      },
      data: remorques,
    });
  } catch (error) {
    next(error);
  }
};

export const getRemorqueById = async (req, res, next) => {
  try {
    const remorque = await Remorque.findById(req.params.id);

    if (!remorque) {
      return res.status(404).Json({
        success: false,
        message: "remorque non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "remorque récupéré avec succès",
      data: remorque,
    });
  } catch (error) {
    next(error);
  }
};

export const updateRemorque = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const remorque = await Remorque.findById(id);
    if (!remorque) {
      return res.status(404).json({
        success: false,
        message: "remorque non trouvé",
      });
    }

    const updatedRemorque = await Remorque.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "remorque mis à jour avec succès",
      data: updatedRemorque,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRemorque = async (req, res, next) => {
  try {
    const { id } = req.params;

    const remorque = await Remorque.findById(id);
    if (!remorque) {
      return res.status(404).json({
        success: false,
        message: "remorque non trouvé",
      });
    }

    const deletedremorque = await Remorque.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "remorque supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
