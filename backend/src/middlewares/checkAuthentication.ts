import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const checkAuthentication = (request: Request, response: Response, next: NextFunction): void => {
  console.log(`🔐 [AUTH] Checking authentication for: ${request.method} ${request.path}`);
  
  const authHeader = request.headers.authorization;
  
  if (!authHeader) {
    console.log(`❌ [AUTH] No Authorization header found`);
    response.status(401).json({ error: "No authorization header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  
  if (!token) {
    console.log(`❌ [AUTH] No token found in Authorization header`);
    response.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (request as any).user = decoded;
    console.log(`✅ [AUTH] Authentication successful for user: ${(decoded as any).userId}`);
    next();
  } catch (error) {
    console.log(`❌ [AUTH] Token verification failed:`, error);
    response.status(401).json({ error: "Invalid token" });
  }
};
