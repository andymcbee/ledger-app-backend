import { Request, Response, NextFunction } from 'express';

export const ensureRequestBodyHasRequiredFields =
  (requiredFields: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const missingFields = [];

    for (const requiredField of requiredFields) {
      if (!req.body[requiredField]) {
        missingFields.push(requiredField);
      }
    }

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ error: `Missing required fields: ${missingFields.join()}` });
    }

    next();
  };
