import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token;
    if (!token) {
      res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
      return;
    }
    // Verify the JWT token
    const decoded = jwt.decode(token as string) as { clerkId: string };
    if (!decoded.clerkId) {
      res.status(401).json({
        success: false,
        message: "clerk id is not present",
      });
    }
    req.clerkId = decoded.clerkId;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error please wait!",
    });
  }
};

export default authMiddleware;
