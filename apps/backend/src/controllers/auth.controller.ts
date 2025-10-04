import type { Request, Response, NextFunction } from 'express';
import { User, type IUser } from '@/models/user.model.js';
import { ResponseBuilder } from '@/helpers/createResponse.js';
import { userSchema } from '@/schema/user.schema.js';
import type { User as UserType } from '@/types/user.type.js';
import {
  generateToken,
  generateRefreshToken,
  refreshAccessToken,
} from '@/helpers/token.js';

// Helper to ensure all required fields are present and types match UserType (except password)
function extractUserData(user: IUser): Omit<UserType, 'password'> {
  const obj = user.toObject();
  const base: Omit<UserType, 'password'> = {
    id: user._id?.toString?.() ?? String(user._id),
    username: user.username,
    email: user.email,
    avatarUrl: typeof user.avatarUrl === 'string' ? user.avatarUrl : '',
    isOnline: typeof user.isOnline === 'boolean' ? user.isOnline : false,
    lastSeen: user.lastSeen ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  const parsed = userSchema.omit({ password: true }).safeParse(base);
  if (parsed.success) {
    return {
      ...parsed.data,
      avatarUrl: parsed.data.avatarUrl ?? '',
      isOnline: parsed.data.isOnline ?? false,
      lastSeen: parsed.data.lastSeen ?? null,
      createdAt: parsed.data.createdAt ?? new Date(0),
      updatedAt: parsed.data.updatedAt ?? new Date(0),
    };
  }
  return {
    ...base,
    avatarUrl: base.avatarUrl ?? '',
    isOnline: base.isOnline ?? false,
    lastSeen: base.lastSeen ?? null,
    createdAt: base.createdAt ?? new Date(0),
    updatedAt: base.updatedAt ?? new Date(0),
  };
}

// Helper to format Zod errors as a string
function formatZodError(error: any): string {
  if (error && Array.isArray(error.issues)) {
    return error.issues.map((issue: any) => issue.message).join('; ');
  }
  if (typeof error === 'string') return error;
  return 'Validation error';
}

// Signup Controller
export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password, avatarUrl } = req.body;

    // Validate input using userSchema (omit id, isOnline, lastSeen, createdAt, updatedAt)
    const parseResult = userSchema
      .omit({
        id: true,
        isOnline: true,
        lastSeen: true,
        createdAt: true,
        updatedAt: true,
      })
      .safeParse({
        username,
        email,
        password,
        avatarUrl,
      });
    if (!parseResult.success) {
      return res
        .status(400)
        .json(
          ResponseBuilder.fail(
            'Validation failed',
            formatZodError(parseResult.error)
          )
        );
    }

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(409)
        .json(ResponseBuilder.fail('User already exists', 'Duplicate user'));
    }

    const user = new User({ username, email, password, avatarUrl });
    await user.save();

    // Generate JWT and Refresh Token
    const token = generateToken(user._id?.toString?.() ?? String(user._id));
    const refreshToken = generateRefreshToken(
      user._id?.toString?.() ?? String(user._id)
    );

    // Return user info (omit password)
    const userData = extractUserData(user);

    res
      .status(201)
      .json(
        ResponseBuilder.ok(
          { user: userData, token, refreshToken },
          'Signup successful'
        )
      );
  } catch (err) {
    next(err);
  }
}

// Login Controller
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid credentials', 'User not found'));
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid credentials', 'Wrong password'));
    }

    // Generate JWT and Refresh Token
    const token = generateToken(user._id?.toString?.() ?? String(user._id));
    const refreshToken = generateRefreshToken(
      user._id?.toString?.() ?? String(user._id)
    );

    // Return user info (omit password)
    const userData = extractUserData(user);

    res
      .status(200)
      .json(
        ResponseBuilder.ok(
          { user: userData, token, refreshToken },
          'Login successful'
        )
      );
  } catch (err) {
    next(err);
  }
}

// Refresh Token Controller
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken || typeof refreshToken !== 'string') {
      return res
        .status(400)
        .json(ResponseBuilder.fail('No refresh token provided'));
    }

    const newAccessToken = refreshAccessToken(refreshToken);
    if (!newAccessToken) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Invalid or expired refresh token'));
    }

    res
      .status(200)
      .json(ResponseBuilder.ok({ token: newAccessToken }, 'Token refreshed'));
  } catch (err) {
    next(err);
  }
}

// Logout Controller (for JWT, client should just delete token; here for completeness)
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Invalidate token on client side; optionally implement token blacklist
    res.status(200).json(ResponseBuilder.ok(null, 'Logout successful'));
  } catch (err) {
    next(err);
  }
}

// Change Password Controller
export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Assume userId is available via auth middleware (e.g., req.user.userId)
    const userId = (req as any).user?.userId;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
      return res
        .status(401)
        .json(ResponseBuilder.fail('Unauthorized', 'No user ID'));
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(ResponseBuilder.fail('User not found'));
    }

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res
        .status(400)
        .json(ResponseBuilder.fail('Old password is incorrect'));
    }

    // Validate newPassword with userSchema's password shape
    const passwordCheck = userSchema.shape.password.safeParse(newPassword);
    if (!passwordCheck.success) {
      return res
        .status(400)
        .json(
          ResponseBuilder.fail(
            'New password invalid',
            formatZodError(passwordCheck.error)
          )
        );
    }

    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json(ResponseBuilder.ok(null, 'Password changed successfully'));
  } catch (err) {
    next(err);
  }
}

// Forget Password Controller (send reset link or code - here, just a stub)
export async function forgetPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const emailCheck = userSchema.shape.email.safeParse(email);
    if (!emailCheck.success) {
      return res
        .status(400)
        .json(
          ResponseBuilder.fail(
            'Invalid email',
            formatZodError(emailCheck.error)
          )
        );
    }

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      return res
        .status(200)
        .json(
          ResponseBuilder.ok(
            null,
            'If the email exists, a reset link will be sent'
          )
        );
    }

    // Here, generate a reset token and send email (stubbed)
    // const resetToken = ...;
    // await sendResetEmail(user.email, resetToken);

    res
      .status(200)
      .json(
        ResponseBuilder.ok(
          null,
          'If the email exists, a reset link will be sent'
        )
      );
  } catch (err) {
    next(err);
  }
}
