import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { Users } from '../../../../infrastructure/database/dbModel/userModel'
import { log } from "console";

declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

export const protectUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");

  log(token, "token123");

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    log(token, "tokenWithoutBearer");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        user: string;
        email: string;
        role: string;
      };
      log(decoded, "decoded");

      req.user = decoded;
      const userId = req.user.user;
      log(userId, "userId");

      const user = await Users.findById(userId);
      log("User found:", user);

      if (!user) {
        log("User not found");
        res.status(401).json({ message: "User not found" });
        return;
      }

      if (user.is_blocked) {
        log("User is blocked");
        res.status(401).json({ message: "User is blocked" });
        return;
      }

      if ((req.user.role === "user")) {
        next();
      }
    } catch (error) {
      log(error, "JWT verification error");
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token expired" });
      } else {
        res.status(401).json({ message: "Not authorized, invalid token" });
      }
    }
  } else {
    log("No token provided");
    res.status(401).json({ message: "Not authorized, no token" });
  }
};
