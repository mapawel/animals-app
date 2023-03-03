import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '@nestjs/common';

export const AppContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (req.get('Content-Type') !== 'application/json')
    throw new BadRequestException('Content-Type must be application/json');
  next();
};
