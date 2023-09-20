import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// This middleware performs the actions:
// Confirm JWT is valid.
// Confirm the provided organization_id is valid.
export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwtToken = req.cookies.jwt; // Assuming the JWT is stored in a "token" cookie

  if (!jwtToken) {
    return res.status(401).json({ message: 'Authentication denied.' });
  }

  try {
    const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key
    const decoded = await jwt.verify(jwtToken, secretKey); // Modify according to your token structure

    // Attach the decoded data to the request object
    req.user_id = decoded.key;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.log('ERROR IN USER AUTH:::::::::::::::::');
    console.log(error);
    return res.status(403).json({ message: 'Invalid auth' });
  }
};
