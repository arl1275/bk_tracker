import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado: token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Acceso no autorizado: token inválido' });
    }
    //req.user = decoded; // Almacenar la información del usuario decodificada en el objeto de solicitud para su uso posterior
    next();
  });
};

export default verifyToken;
