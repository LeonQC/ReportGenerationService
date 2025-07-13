import jwt from "jsonwebtoken";

export const generateJWT = (user: any): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
    issuer: "report-service",
  });
};

export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
