import crypto from 'crypto';

/**
 * Generates a random salt for password hashing
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * Hashes a password with a salt
 */
export function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

/**
 * Verifies a password against a hash
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const hashToVerify = hashPassword(password, salt);
  return hashToVerify === hash;
}

/**
 * Generates a secure random token
 */
export function generateToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generates a JWT secret
 */
export function generateJWTSecret(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Creates a hash from a string (for verification codes, etc.)
 */
export function createHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex');
}
