import jwt from "jsonwebtoken"

const getSecret = () => process.env.JWT_SECRET;

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token) {
  return jwt.verify(token, getSecret());
}

