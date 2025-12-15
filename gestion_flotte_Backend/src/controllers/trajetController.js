import Camion from "../models/Camion.js";
import Remorque from "../models/Remorque.js";
import Trajet from "../models/Trajet.js";
import User from "../models/User.js";

export const createTrajet = async (req, res, next) => {
  try {
    const {
      chauffeurId,
      camionId,
      remorqueId,
      lieuDepart,
      lieuArrivee,
      dateDepart,
      dateArrivee,
      remarque,
    } = req.body;

    const chauffeur = await User.findById(chauffeurId);
    if (!chauffeur) {
      const err = new Error("Chauffeur non trouvé");
      err.statusCode = 404;
      throw err;
    }

    const camion = await Camion.findById(camionId);
    if (!camion) {
      const err = new Error("Camion non trouvé");
      err.statusCode = 404;
      throw err;
    }

    const remorque = await Remorque.findById(remorqueId);
    if (!remorque) {
      const err = new Error("Remorque non trouvé");
      err.statusCode = 404;
      throw err;
    }

    const trajet = await Trajet.create({
      chauffeurId,
      camionId,
      remorqueId,
      lieuDepart,
      lieuArrivee,
      dateDepart,
      dateArrivee,
      remarque,
    });

    res.status(201).json({
      success: true,
      message: "trajet créé avec succés",
      data: trajet,
    });
  } catch (error) {
    next(error);
  }
};

//recuperation de tout les trajets
export const getAllTrajets = async (req, res, next) => {
  try {

    const trajets = await Trajet.find()
      .populate("chauffeurId", "nom email")
      .populate("camionId", "immatriculation marque modele")
      .populate("remorqueId", "immatriculation type")
      .sort({ createdAt: -1 });

    const totalItems = await Trajet.countDocuments();

    res.status(200).json({
      success: true,
      message: "trajets récupérés avec succès",
      metaData: {
        totalItems,
        count: trajets.length,
      },
      data: trajets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrajetsChauffeur = async (req, res, next) => {
  try {
    console.log("REQ.USER:", req.user);
    const chauffeurId = req.query.chauffeurId || req.user._id;
    const trajets = await Trajet.find({ chauffeurId })
      .populate("camionId", "immatriculation marque modele")
      .populate("remorqueId", "immatriculation type");

    res.status(200).json({
      success: true,
      message: "les trajets du chauffeur récupérés avec succès",
      metaData: {
        count: trajets.length,
      },
      data: trajets,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrajetById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trajet = await Trajet.findById(id)
      .populate("chauffeurId", "nom email")
      .populate("camionId", "immatriculation marque modele")
      .populate("remorqueId", "immatriculation type");

    if (!trajet) {
      const err = new Error("Trajet non trouvé");
      err.statusCode = 404;
      throw err;
    }

    const user = req.user;
    if (
      user.role === "chauffeur" &&
      trajet.chauffeurId._id.toString() !== user.id
    ) {
      const err = new Error(
        "Accès refusé : vous ne pouvez consulter que vos trajets"
      );
      err.statusCode = 403;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Trajet récupéré avec succès",
      data: trajet,
    });
  } catch (error) {
    next(error);
  }
};

//la mise à jours du trajet par le chauffeur
export const updateTrajetChauffeur = async (req, res, next) => {
  try {
    const trajet = await Trajet.findById(req.params.id);
    if (!trajet) {
      const err = new Error("Trajet non trouvé");
      err.statusCode = 404;
      throw err;
    }

    if (trajet.chauffeurId.toString() !== req.user.id) {
      const err = new Error("Accès refusé : ce trajet ne vous appartient pas");
      err.statusCode = 403;
      throw err;
    }

    const { kmDepart, kmArrivee, statut, volumeGasoil, remarque } = req.body;

    if (kmDepart == null || !statut) {
      const err = new Error(
        "Veuillez remplir tous les champs obligatoires : kmDepart, statut"
      );
      err.statusCode = 400;
      throw err;
    }

    if (statut === "terminé" && (kmArrivee == null || volumeGasoil == null)) {
      const err = new Error("kmArrivee et volumeGasoil sont obligatoires");
      err.statusCode = 400;
      throw err;
    }

    trajet.kmDepart = kmDepart;
    trajet.kmArrivee = kmArrivee;
    trajet.statut = statut;
    trajet.volumeGasoil = volumeGasoil;
    if (remarque != null) trajet.remarque = remarque;

    await trajet.save();

    res.status(200).json({
      success: true,
      message: "trajet modifier avec succés",
      data: trajet,
    });
  } catch (error) {
    next(error);
  }
};

// update trajet par admin
export const updatetrajet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const trajet = await Trajet.findById(id);
    
    const updatedtrajet = await Trajet.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    
    if (!updatedtrajet) {
      const err = new Error("trajet non trouvé");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({
      success: true,
      message: "trajet mis à jour avec succès",
      data: updatedtrajet,
    });
  } catch (error) {            
    next(error);
  }
};

export const deleteTrajet = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedTrajet = await Trajet.findByIdAndDelete(id);

    if (!deletedTrajet) {
      return res.status(404).json({
        success: false,
        message: "Trajet non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "trajet supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};
