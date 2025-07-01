import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAuthentication = (request: Request, response: Response, next: NextFunction) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    return response.status(401).json({ message: 'Authorization header required' });
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    return response.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (request as any).user = decoded;
    next();
  } catch (error) {
    return response.status(401).json({ message: 'Invalid token' });
  }
};
