import type { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { ResponseBuilder } from '../helpers/createResponse';

/**
 * Middleware to verify JWT access token and attach user info to req.user.
 * Expects downstream helpers to have a verifyAccessToken(token) implementation.
 */
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'supersecretkey';

export function verifyUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (
    !authHeader ||
    typeof authHeader !== 'string' ||
    !authHeader.startsWith('Bearer ')
  ) {
    return res
      .status(401)
      .json(ResponseBuilder.unauthorized('No token provided'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json(ResponseBuilder.unauthorized('Token missing'));
  }

  try {
    // Verify and decode payload using JWT
    const payload = jwt.verify(token, jwtSecret) as { userId?: string };
    if (!payload || !payload.userId) {
      return res
        .status(401)
        .json(ResponseBuilder.unauthorized('Invalid or expired token'));
    }
    (req as any).userId = payload.userId;
    next();
  } catch (err: any) {
    if (err && err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Token expired', 'Access token expired'));
    }
    return res
      .status(401)
      .json(ResponseBuilder.unauthorized('Invalid token'));
  }
}

/**
 * Middleware to ensure the current user is an admin.
 * Requires verifyUser to have run before it.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) {
      return res
        .status(401)
        .json(ResponseBuilder.unauthorized('No user ID'));
    }

    const user = await UserModel.findById(userId).select('role');
    if (!user) {
      return res.status(404).json(ResponseBuilder.notFound('User not found'));
    }

    if ((user as any).role !== 'admin') {
      return res
        .status(403)
        .json(ResponseBuilder.forbidden('Admin privileges required'));
    }

    next();
  } catch (err) {
    next(err as Error);
  }
}
