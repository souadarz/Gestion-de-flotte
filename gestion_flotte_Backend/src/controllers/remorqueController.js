import Remorque from "../models/Remorque.js";

export const createRemorque = async (req, res, next) => {
  try {
    const { immatriculation, type, statut } = req.body;

    const remorqueExistant = await Remorque.findOne({
      immatriculation,
    });

    if (remorqueExistant) {
      const err = new Error("un remorque avec cette immatriculation existe deja");
      err.statusCode = 404;
      throw err;
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
      const err = new Error("remorque non trouvé");
      err.statusCode = 404;
      throw err;
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

    const updatedRemorque = await Remorque.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateRemorque) {
      const err = new Error("remorque non trouvé");
      err.statusCode = 404;
      throw err;
    }

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

    const deletedRemorque = await Remorque.findByIdAndDelete(id);

    if (!deletedRemorque) {
      const err = new Error("remorque non trouvé");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "remorque supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
