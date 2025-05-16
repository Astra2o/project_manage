import jwt from "jsonwebtoken";

export function authenticate(token: string) {
  if (!token) throw new Error("Invalid token");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.verify(token, process.env.JWT_SECRET);
}
