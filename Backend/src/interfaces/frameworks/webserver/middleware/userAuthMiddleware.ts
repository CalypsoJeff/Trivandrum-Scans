import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { Users } from '../../../../infrastructure/database/dbModel/userModel'

declare module "express-serve-static-core" {
  interface Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
  }
}

export const protectUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");
  console.log(token, "token123");
  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    console.log(token, "tokenWithoutBearer");
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        user: string;
        email: string;
        role: string;
      };
      console.log(decoded, "decoded");
      req.user = decoded;
      const userId = req.user.user;
      console.log(userId, "userId");
      const user = await Users.findById(userId);
      console.log("User found:", user);
      if (!user) {
        console.log("User not found");
        res.status(401).json({ message: "User not found" });
        return;
      }
      if (user.is_blocked) {
        console.log("User is blocked");
        res.status(403).json({ message: "User is blocked" });
        return;
      }
      if ((req.user.role === "user")) {
        next();
      }
    } catch (error) {
      console.log(error, "JWT verification error");
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
      } else {
        res.status(401).json({ message: "Not authorized, invalid token" });
      }
    }
  } else {
    console.log("No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
