import RegleMaintenance from "../models/RegleMaintenance.js";

export const createRegleMaintenance = async (req, res, next) => {
  try {
    const {
      type,
      periodiciteKm,
      periodiciteMois,
      description,
      seuilAlerteKm,
      seuilAlerteJours,
    } = req.body;

    const regleMaintenanceExistant = await RegleMaintenance.findOne({ type });
    if (regleMaintenanceExistant) {
      const err = new Error(
        `Une règle de maintenance pour "${type}" existe déjà`
      );
      err.statusCode = 409;
      throw err;
    }

    const regleMaintenance = await RegleMaintenance.create({
      type,
      periodiciteKm,
      periodiciteMois,
      description,
      seuilAlerteKm,
      seuilAlerteJours,
    });

    res.status(201).json({
      success: true,
      message: "Règle de maintenance créée avec succès",
      data: regleMaintenance,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllRegleMaintenance = async (req, res, next) => {
  try {
    const regles = await RegleMaintenance.find().sort({ createdAt: -1 });

    const totalItems = await RegleMaintenance.countDocuments();

    res.status(200).json({
      success: true,
      message: "Regles de maintenance récupérées avec succès",
      metaData: {
        totalItems,
        count: regles.length,
      },
      data: regles,
    });
  } catch (error) {
    next(error);
  }
};

// get by id

export const getRegleMaintenanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const regle = await RegleMaintenance.findById(id);

    if (!regle) {
      const err = new Error("Règle de maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Règle de maintenance récupérée avec succès",
      data: regle,
    });
  } catch (error) {
    next(error);
  }
};

// update regle maintenance
export const updateRegleMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      type,
      periodiciteKm,
      periodiciteMois,
      description,
      seuilAlerteKm,
      seuilAlerteJours,
    } = req.body;

    const regleExistante = await RegleMaintenance.findById(id);
    if (!regleExistante) {
      const err = new Error("Règle de maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    if (type && type !== regleExistante.type) {
      const regleAvecMemeType = await RegleMaintenance.findOne({ type });
      if (regleAvecMemeType) {
        const err = new Error(
          `Une règle de maintenance pour "${type}" existe déjà`
        );
        err.statusCode = 409;
        throw err;
      }
    }

    regleExistante.type = type ?? regleExistante.type;
    regleExistante.periodiciteKm =
      periodiciteKm ?? regleExistante.periodiciteKm;
    regleExistante.periodiciteMois =
      periodiciteMois ?? regleExistante.periodiciteMois;
    regleExistante.description = description ?? regleExistante.description;
    regleExistante.seuilAlerteKm =
      seuilAlerteKm ?? regleExistante.seuilAlerteKm;
    regleExistante.seuilAlerteJours =
      seuilAlerteJours ?? regleExistante.seuilAlerteJours;

    const regleUpdated = await regleExistante.save();

    res.status(200).json({
      success: true,
      message: "Règle de maintenance mise à jour avec succès",
      data: regleUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRegleMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRegle = await RegleMaintenance.findByIdAndDelete(id);

    if (!deletedRegle) {
      const err = new Error("Règle de maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Règle de maintenance supprimée avec succès",
    });
  } catch (error) {
    next(error);
  }
};
