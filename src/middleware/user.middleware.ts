import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

interface TokenPayload {
  userId: string;
}

function verifyToken(token: string) {
  try {

    if (!process.env.JWT_SECRET) {
      return null
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
   
    console.error('Error verifying token:', error);
    return null;
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return res.sendStatus(403); // Forbidden
  }

  (req as any).user = decodedToken;
  next();
}


