import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const gen_token = (payload: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is not set.');
    }

    const secretKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    return token; 
}
