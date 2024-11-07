import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";
import { log } from "console";
import { Admin } from "../../../../infrastructure/database/dbModel/adminModel";

// Extend the Request interface to include the admin property
declare module "express-serve-static-core" {
  interface Request {
    admin?: { user: string; email: string; role: string };
  }
}

export const protectAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.header("Authorization");

  // log(token, "tokenadmin");

  if (token && token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
    // log(token, "tokenWithoutBearer");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        user: string;
        email: string;
        role: string;
      };

      req.admin = decoded;
      const adminId = req.admin.user;

      const admin = await Admin.findById(adminId);
      log("admin found:", admin);

      if (!admin) {
        log("admin not found");
        return res.status(401).json({ message: "admin not found" });
      }

      if (req.admin.role === "admin") {
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Not authorized, admin role required" });
      }
    } catch (error) {
      log(error, "JWT verification error");
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res
          .status(401)
          .json({ message: "Not authorized, invalid token" });
      }
    }
  } else {
    log("No token provided");
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
