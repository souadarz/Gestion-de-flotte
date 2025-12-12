import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      const err = new Error("email et mot de passe sont obligatoires");
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(motDePasse))) {
      const err = new Error("Email ou mot de passe incorrect");
      err.statusCode = 401;
      throw err;
    }

    //generartion du token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "connexion réussie",
      token,
      data: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserConnected = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      const err = new Error("Utilisateur non trouvé");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        nom: user.nom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    next(error);
  }
};
