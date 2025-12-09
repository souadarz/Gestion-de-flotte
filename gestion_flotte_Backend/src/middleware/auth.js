import User from "../models/User";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Accès refusé. Aucun token fourni.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Token invalide.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalide.",
    });
  }
};

export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Utilisateur non authentifié" });
    }

    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Accès refusé: rôle non autorisé" });
    }
    next();
  };
};
