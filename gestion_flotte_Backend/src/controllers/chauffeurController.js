import { sendMail } from "../config/mail.js";
import User from "../models/User.js";
import crypto from "crypto";

export const createChauffeur = async (req, res, next) => {
  try {
    const { nom, email } = req.body;

    const password = crypto.randomBytes(4).toString("hex");

    const chauffeurExistant = await User.findOne({ email });
    if (chauffeurExistant) {
      return res.status(400).json({
        success: false,
        message: "Un chauffeur avec cet email existe deja",
      });
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
      text: "zertyuio",
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

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "chauffeurs récupérés avec succès",
      metaData: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
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
      return res.status(404).Json({
        success: false,
        message: "Chauffeur non trouvé",
      });
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
