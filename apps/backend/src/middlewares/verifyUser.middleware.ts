import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/helpers/token.js';
import { ResponseBuilder } from '@/helpers/createResponse.js';
import { User } from '@/models/user.model.js';

/**
 * Middleware to verify JWT access token and attach user info to req.user.
 * If token is missing or invalid, responds with 401 Unauthorized.
 * If token is expired, responds with 401.
 */
export function verifyUser(req: Request, res: Response, next: NextFunction) {
  // Get token from Authorization header: "Bearer <token>"
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];
  if (
    !authHeader ||
    typeof authHeader !== 'string' ||
    !authHeader.startsWith('Bearer ')
  ) {
    return res
      .status(401)
      .json(ResponseBuilder.fail('Unauthorized', 'No token provided'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res
      .status(401)
      .json(ResponseBuilder.fail('Unauthorized', 'Token missing'));
  }

  try {
    // Try to verify token
    const payload = verifyAccessToken(token);
    if (!payload || !payload.userId) {
      // If payload is null, could be invalid or expired
      return res
        .status(401)
        .json(ResponseBuilder.fail('Unauthorized', 'Invalid or expired token'));
    }
    // Attach user info to request for downstream use
    (req as any).user = { userId: payload.userId };
    next();
  } catch (err: any) {
    // If error is TokenExpiredError, signal client to refresh
    if (err && err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Token expired', 'Access token expired'));
    }
    // Other errors
    return res
      .status(401)
      .json(ResponseBuilder.fail('Unauthorized', 'Invalid token'));
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
    const userId = (req as any).user?.userId as string | undefined;
    if (!userId) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Unauthorized', 'No user ID'));
    }

    const user = await User.findById(userId).select('role');
    if (!user) {
      return res.status(404).json(ResponseBuilder.fail('User not found'));
    }

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json(ResponseBuilder.fail('Forbidden', 'Admin privileges required'));
    }

    next();
  } catch (err) {
    next(err as Error);
  }
}
