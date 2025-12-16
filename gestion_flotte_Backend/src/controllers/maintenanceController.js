import Camion from "../models/Camion.js";
import Remorque from "../models/Remorque.js";
import Maintenance from "../models/Maintenance.js";
import RegleMaintenance from "../models/regleMaintenance.js";

//create maintenance
export const createMaintenance = async (req, res, next) => {
  try {
    const {
      vehiculeType,
      vehiculeId,
      regleMaintenanceId,
      type,
      dateMaintenance,
      kilometrageRealisation,
      cout,
      description,
    } = req.body;

    const vehiculeModel = vehiculeType === "camion" ? "Camion" : "Remorque";
    // Vérifier que le véhicule existe
    let vehicule;
    if (vehiculeType === "camion") {
      vehicule = await Camion.findById(vehiculeId);
      if (!vehicule) { 
        const err = new Error("Camion non trouvé");
        err.statusCode = 404;
        throw err;
      }
    } else if (vehiculeType === "remorque") {
      vehicule = await Remorque.findById(vehiculeId);
      if (!vehicule) {
        const err = new Error("Remorque non trouvée");
        err.statusCode = 404;
        throw err;
      }
    }

    // Vérifier que la règle de maintenance existe
    const regle = await RegleMaintenance.findById(regleMaintenanceId);
    if (!regle) {
      const err = new Error("Règle de maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    const maintenance = await Maintenance.create({
      vehiculeType,
      vehiculeId,
      vehiculeModel,
      regleMaintenanceId,
      type,
      dateMaintenance,
      kilometrageRealisation,
      cout,
      description,
    });

    // Mettre à jour le kilométrage de dernière maintenance du véhicule
    if (vehiculeType === "camion" && type === "vidange") {
      await Camion.findByIdAndUpdate(vehiculeId, {
        kmDerniereVidange: kilometrageRealisation,
      });
    }

    res.status(201).json({
      success: true,
      message: "Maintenance créée avec succès",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

//all maintenances
export const getAllMaintenance = async (req, res, next) => {
  try {
    const maintenances = await Maintenance.find()
      .populate("regleMaintenanceId", "type")
      .populate({
        path: "vehiculeId",
        select: "immatriculation marque modele type",
      })
      .sort({ dateMaintenance: -1 });

    const totalItems = await Maintenance.countDocuments();

    res.status(200).json({
      success: true,
      message: "Maintenances récupérées avec succès",
      metaData: {
        totalItems,
      },
      data: maintenances,
    });
  } catch (error) {
    next(error);
  }
};

//get maintenance by id

export const getMaintenanceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const maintenance = await Maintenance.findById(id)
      .populate(
        "regleMaintenanceId",
        "type description periodiciteKm periodiciteMois"
      )
      .populate({
        path: "vehiculeId",
        select: "immatriculation marque modele type",
      });

    if (!maintenance) {
      const err = new Error("Maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Maintenance récupérée avec succès",
      data: maintenance,
    });
  } catch (error) {
    next(error);
  }
};

// update maintenance et kmDerniereVidange si vidange
export const updateMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const maintenance = await Maintenance.findById(id);

    if (!maintenance) {
      const err = new Error("Maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    const updatedMaintenance = await Maintenance.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    // Si le kilométrage de réalisation est mis à jour et c'est une vidange
    if (
      updateData.kilometrageRealisation &&
      maintenance.type === "vidange" &&
      maintenance.vehiculeType === "camion"
    ) {
      await Camion.findByIdAndUpdate(maintenance.vehiculeId, {
        kmDerniereVidange: updateData.kilometrageRealisation,
      });
    }

    res.status(200).json({
      success: true,
      message: "Maintenance mise à jour avec succès",
      data: updatedMaintenance,
    });
  } catch (error) {
    next(error);
  }
};

//delete maintenance
export const deleteMaintenance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedMaintenance = await Maintenance.findByIdAndDelete(id);

    if (!deletedMaintenance) {
      const err = new Error("Maintenance non trouvée");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Maintenance supprimée avec succès",
    });
  } catch (error) {
    next(error);
  }
};


// Calculer la prochaine maintenance pour un véhicule
export const calculerProchaineMaintenance = async (req, res, next) => {
  try {
    const { vehiculeId } = req.params;
    const { vehiculeType, type } = req.query;

    if (!vehiculeType) {
      const err = new Error("Le type de véhicule (vehiculeType) est requis");
      err.statusCode = 400;
      throw err;
    }

    // Récupérer le véhicule
    let vehicule;
    if (vehiculeType === "camion") {
      vehicule = await Camion.findById(vehiculeId);
    } else if (vehiculeType === "remorque") {
      vehicule = await Remorque.findById(vehiculeId);
    }

    if (!vehicule) {
      const err = new Error(
        `${vehiculeType === "camion" ? "Camion" : "Remorque"} non trouvé(e)`
      );
      err.statusCode = 404;
      throw err;
    }

    // Récupérer la règle de maintenance
    const regle = await RegleMaintenance.findOne({ type });
    if (!regle) {
      const err = new Error(
        `Règle de maintenance pour le type "${type}" non trouvée`
      );
      err.statusCode = 404;
      throw err;
    }

    // Récupérer la dernière maintenance de ce type
    const derniereMaintenance = await Maintenance.findOne({
      vehiculeId,
      vehiculeType,
      type,
    }).sort({ dateMaintenance: -1 });

    let prochaineMaintenanceKm = null;
    let prochaineMaintenanceDate = null;
    let kmRestants = null;
    let joursRestants = null;

    // Calcul basé sur le kilométrage
    if (regle.periodiciteKm && vehiculeType === "camion") {
      const kmBase = derniereMaintenance
        ? derniereMaintenance.kilometrageRealisation
        : vehicule.kmDerniereVidange || 0;

      prochaineMaintenanceKm = kmBase + regle.periodiciteKm;
      kmRestants = prochaineMaintenanceKm - vehicule.kilometrageActuel;
    }

    // Calcul basé sur le temps
    if (regle.periodiciteMois) {
      const dateBase = derniereMaintenance
        ? new Date(derniereMaintenance.dateMaintenance)
        : new Date();

      prochaineMaintenanceDate = new Date(dateBase);
      prochaineMaintenanceDate.setMonth(
        prochaineMaintenanceDate.getMonth() + regle.periodiciteMois
      );

      const aujourdhui = new Date();
      const diffTime = prochaineMaintenanceDate - aujourdhui;
      joursRestants = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Déterminer si une alerte doit être envoyée
    let alerteNecessaire = false;
    let raisonAlerte = [];

    if (kmRestants !== null && kmRestants <= regle.seuilAlerteKm) {
      alerteNecessaire = true;
      raisonAlerte.push(
        `Seuil kilométrique atteint (${kmRestants} km restants)`
      );
    }

    if (joursRestants !== null && joursRestants <= regle.seuilAlerteJours) {
      alerteNecessaire = true;
      raisonAlerte.push(
        `Seuil temporel atteint (${joursRestants} jours restants)`
      );
    }

    res.status(200).json({
      success: true,
      message: "Prochaine maintenance calculée avec succès",
      data: {
        vehicule: {
          id: vehicule._id,
          type: vehiculeType,
          immatriculation: vehicule.immatriculation,
          kilometrageActuel: vehicule.kilometrageActuel,
        },
        regle: {
          type: regle.type,
          periodiciteKm: regle.periodiciteKm,
          periodiciteMois: regle.periodiciteMois,
        },
        derniereMaintenance: derniereMaintenance
          ? {
              date: derniereMaintenance.dateMaintenance,
              kilometrage: derniereMaintenance.kilometrageRealisation,
            }
          : null,
        prochaineMaintenance: {
          kilometrage: prochaineMaintenanceKm,
          date: prochaineMaintenanceDate,
          kmRestants,
          joursRestants,
        },
        alerte: {
          necessaire: alerteNecessaire,
          raisons: raisonAlerte,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
