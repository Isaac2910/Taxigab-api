import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();


export const isAuthenticated = (  req, res, next ) =>{

    try{
        const authHaeder = req.header.authorization;

        if(!authHaeder){
            return res.status(401).json({message: 'Veuillez vous connecter pour accéder à ce contenu !'});
        }

        const token = authHaeder.split('')[1];
        if(!token){
            retrun.res.status(401).json({message: 'token absent!!!'});
        }

        jwt.verify (token, 
            process.env.ACCES_TOKEN_SECRET || '', 
            async (err, decoded) =>{ if (err) { 
            return res.status(401).json({message: 'token non valider'});
        }

        const userData = await Prisma.user.findUnique({
            where : { id: decoded.id,},
        });

        if (!userData) {
            return res.status(401).json({ message: 'Utilisateur non trouvé !' });
          }

        req.user = userData;
        next();  

        } 

    );
    }  catch (error) {
        console.log(error);
        res.status(500).json({message: 'Erreur du serveur !'});

    }
};



export const isAuthenticatedDriver = ( req, res, next ) => {
    try {
      
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Please Log in to access this content!" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }
  
      
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET|| '',
        async (err, decoded) => {
          if (err) {
            return res.status(401).json({ message: "Invalid token" });
          }
  
          const driverData = await prisma.driver.findUnique({
            where: {
              id: decoded.id,
            },
          });
         

          req.driver = driverData;
          next();
        }
      );
    } catch (error) {
      console.log(error);
    }
  };


