import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_clé_secrète'; 
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extrait le token du header Authorization

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; // Ajoute l'utilisateur décodé à la requête
      next();
    });
  } else {
    res.sendStatus(401); // Pas de token
  }
};


