import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuthentication = (request: Request, response: Response, next: NextFunction) => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return response.status(401).json({ 
        success: false, 
        message: 'Token d\'authentification manquant' 
      });
    }

    const token = authHeader.substring(7); // Enlever "Bearer "
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    
    const decoded = jwt.verify(token, secret) as any;
    
    // Ajouter les informations utilisateur à la requête
    (request as any).user = decoded;
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return response.status(401).json({ 
      success: false, 
      message: 'Token d\'authentification invalide' 
    });
  }
};
