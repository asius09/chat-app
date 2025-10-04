import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'refreshsupersecretkey';
const JWT_EXPIRES_IN = '7d';
const JWT_REFRESH_EXPIRES_IN = '30d';

/**
 * Generate an access token for a user.
 * @param userId string
 * @returns string (JWT access token)
 */
export function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Generate a refresh token for a user.
 * @param userId string
 * @returns string (JWT refresh token)
 */
export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRES_IN,
  });
}

/**
 * Verify an access token and return the decoded payload if valid.
 * @param token string
 * @returns { userId: string } | null
 */
export function verifyAccessToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Verify a refresh token and return the decoded payload if valid.
 * @param token string
 * @returns { userId: string } | null
 */
export function verifyRefreshToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
    return decoded;
  } catch (err) {
    return null;
  }
}

/**
 * Generate a new access token from a valid refresh token.
 * @param refreshToken string
 * @returns string | null (new access token)
 */
export function refreshAccessToken(refreshToken: string): string | null {
  const payload = verifyRefreshToken(refreshToken);
  if (!payload) return null;
  // Generate new access token
  return jwt.sign({ userId: payload.userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}
