import jwt from "jsonwebtoken";
import argon2 from "argon2";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";

// Generate access token
export const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user?.id, email: user?.email, role: user?.accountType },
    JWT_ACCESS_SECRET,
    { expiresIn: "7d" }
  );
};

// Generate refresh token
export const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user?.id }, JWT_REFRESH_SECRET, { expiresIn: "30d" });
};

// Verify access token
export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET);
  } catch (error) {
    return null;
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password using Argon2
export const hashPassword = async (password: string) => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    throw new Error("Password hashing failed");
  }
};

// Compare password using Argon2
export const comparePassword = async (password: string, hashedPassword: string) => {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (err) {
    throw new Error("Password comparison failed");
  }
};
