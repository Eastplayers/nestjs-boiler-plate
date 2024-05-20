import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';

export async function hashingPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  const hashedPassword: string = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export function generateJwtToken(tokenPayload, expiration?: string) {
  return jsonwebtoken.sign(tokenPayload, process.env.JWT_SECRET, {
    expiresIn: expiration || '90 days',
  });
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function verifyJwtToken(token: string): [boolean, any] {
  return [
    decodeJwtToken(token).isSuccess,
    decodeJwtToken(token).isSuccess ? decodeJwtToken(token).value : null,
  ];
}

export function decodeJwtToken(token: string): {
  isSuccess: boolean;
  value: any;
} {
  try {
    return {
      isSuccess: true,
      value: jsonwebtoken.verify(token, process.env.JWT_SECRET),
    };
  } catch (error) {
    return {
      isSuccess: false,
      value: error.message,
    };
  }
}
