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
      text:"zertyuio",
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
