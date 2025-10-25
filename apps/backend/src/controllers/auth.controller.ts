import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserModel, IUser } from '../models/user.model';
import {
  generateToken,
  generateRefreshToken,
  refreshAccessToken,
} from '../helpers/token';
import { ResponseBuilder } from '../helpers/createResponse';

// Note: Zod validation is already handled at router-level (see auth.router.ts). Schemas are for reference only, kept in router.
// This controller expects req.validated to contain the already validated payload from validation middleware.

// Helper to safely extract string _id from a UserModel document
function getUserId(user: IUser): string {
  // Mongoose Document's _id is usually a BSON ObjectId, but TypeScript doesn't always know.
  // Use .toString() safely if _id exists:
  if (user && user._id && typeof (user._id as any).toString === 'function') {
    return (user._id as any).toString();
  }
  throw new Error('User _id is missing or invalid');
}

export async function signup(req: Request, res: Response) {
  // req.validated is set by the validate middleware (see auth.router.ts)
  const { username, email, password } = (req as any).validated;

  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json(ResponseBuilder.fail('Email already registered', 'Email exists', undefined, undefined));
    }
    const hash = await bcrypt.hash(password, 10);
    const user = new UserModel({ username, email, password: hash });
    await user.save();

    const userId = getUserId(user);
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return res.status(201).json(
      ResponseBuilder.ok(
        {
          token,
          refreshToken,
          user: { id: userId, username, email },
        },
        'Signup successful'
      )
    );
  } catch (e) {
    return res
      .status(500)
      .json(ResponseBuilder.fail('Internal server error', (e as Error).message));
  }
}

export async function login(req: Request, res: Response) {
  const { email, password } = (req as any).validated;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid credentials', 'Incorrect email or password'));
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid credentials', 'Incorrect email or password'));
    }
    const userId = getUserId(user);
    const token = generateToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return res.status(200).json(
      ResponseBuilder.ok(
        {
          token,
          refreshToken,
          user: { id: userId, username: user.username, email: user.email },
        },
        'Login successful'
      )
    );
  } catch (e) {
    return res
      .status(500)
      .json(ResponseBuilder.fail('Internal server error', (e as Error).message));
  }
}

export function logout(req: Request, res: Response) {
  // Stateless JWT: just tell client to remove token.
  return res.json(
    ResponseBuilder.ok(
      { },
      'Logged out (remove token on client)'
    )
  );
}

export async function changePassword(req: Request, res: Response) {
  // Assumes req.userId (from verifyUser.middleware) and req.validated (from validation.middleware)
  const { oldPassword, newPassword } = (req as any).validated;
  const userId = (req as any).userId;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('User not found', 'Invalid user ID'));
    }
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Old password incorrect', 'Authentication failed'));
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.json(ResponseBuilder.ok(null, 'Password changed'));
  } catch (e) {
    return res
      .status(500)
      .json(ResponseBuilder.fail('Internal server error', (e as Error).message));
  }
}

export async function forgetPassword(req: Request, res: Response) {
  // No side-effect; just always "success" for this demo
  return res.json(
    ResponseBuilder.ok(
      null,
      'If registered, an email would be sent'
    )
  );
}

export async function refresh(req: Request, res: Response) {
  // Demo: Accepts refreshToken in body, returns new access token
  // (For production, consider HTTP Only cookies & blacklist/rotation)
  try {
    const refreshToken = req.body?.refreshToken || (req as any).refreshToken;
    if (!refreshToken) {
      return res
        .status(400)
        .json(ResponseBuilder.fail('Refresh token required', 'No refreshToken provided'));
    }
    const token = refreshAccessToken(refreshToken);
    if (!token) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid refresh token', 'Could not verify or expired refresh token'));
    }
    // Decode to get userId (refreshAccessToken only generates if verifyRefreshToken passed)
    const { userId } = (await import('../helpers/token')).verifyRefreshToken(refreshToken) ?? {};
    if (!userId) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid refresh token', 'Refresh token payload invalid'));
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('User does not exist', 'User not found'));
    }
    const id = getUserId(user);

    return res.json(
      ResponseBuilder.ok(
        {
          token,
          user: { id, username: user.username, email: user.email }
        },
        'New access token issued'
      )
    );
  } catch (e) {
    return res
      .status(500)
      .json(ResponseBuilder.fail('Internal server error', (e as Error).message));
  }
}
