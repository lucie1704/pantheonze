import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const checkAuthentication = (request: Request, response: Response, next: NextFunction) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader) {
    response.status(401).json({ message: 'Authorization header required' });
    return;
  }

  const token = authorizationHeader.split(' ')[1];

  if (!token) {
    response.status(401).json({ message: 'Token required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (request as any).user = decoded;
    next();
  } catch (error) {
    response.status(401).json({ message: 'Invalid token' });
  }
};
