import { sendMail } from "../config/mail.js";
import User from "../models/User.js";
import crypto from "crypto";

export const createChauffeur = async (req, res, next) => {
  try {
    const { nom, email } = req.body;

    const password = crypto.randomBytes(4).toString("hex");

    const chauffeurExistant = await User.findOne({ email });
    if (chauffeurExistant) {
      const err = new Error("Un chauffeur avec cet email existe déjà");
      err.statusCode = 400;
      throw err;
    }

    const chauffeur = await User.create({
      nom,
      email,
      motDePasse: password,
      role: "chauffeur",
    });

    await sendMail({
      to: chauffeur.email,
      subject: "Votre compte chauffeur",
      text: `
        Bonjour ${chauffeur.nom}, Votre compte chauffeur a été créé.
        Identifiants :
          - Email : ${chauffeur.email}
          - Mot de passe : ${password}
        Merci de changer votre mot de passe après connexion.
      `,
      html: `
        <h3>Bonjour ${chauffeur.nom},</h3>
        <p>Votre compte chauffeur a été créé.</p>
        <p><strong>Email :</strong> ${chauffeur.email}</p>
        <p><strong>Mot de passe :</strong> ${password}</p>
        <p>Veuillez vous connecter puis changer votre mot de passe.</p>
        `,
    });

    res.status(201).json({
      success: true,
      message: "Chauffeur créé avec succès et email envoyé",
      data: chauffeur,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChauffeurs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    //filtre de recherche
    const filter = {
      role: "chauffeur",
      $or: [
        { nom: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const skip = (page - 1) * limit;

    const chauffeurs = await User.find(filter)
      .select("-motDePasse")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const totalItems = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "chauffeurs récupérés avec succès",
      metaData: {
        totalItems,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalItems / limit),
        count: chauffeurs.length,
      },
      data: chauffeurs,
    });
  } catch (error) {
    next(error);
  }
};

export const getChauffeurById = async (req, res, next) => {
  try {
    const chauffeur = await User.findById(req.params.id).select("-motDePasse");

   
    if (!chauffeur) {
      const err = new Error("Chauffeur non trouvé");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      message: "Chauffeur récupéré avec succès",
      data: chauffeur,
    });
  } catch (error) {
    next(error);
  }
};
