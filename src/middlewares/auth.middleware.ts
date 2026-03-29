// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const authenticate = (req: any, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization;

//     console.log("AUTH HEADER:", authHeader); // debug
//     console.log("JWT SECRET:", process.env.JWT_SECRET); // debug

//     if (!authHeader) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     // ✅ Support both formats
//     let token = authHeader;

//     if (authHeader.startsWith("Bearer ")) {
//       token = authHeader.split(" ")[1];
//     }

//     if (!process.env.JWT_SECRET) {
//       throw new Error("JWT_SECRET missing");
//     }

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = decoded; // { userId }

//     next();
//   } catch (error: any) {
//     console.log("JWT ERROR:", error.message);

//     return res.status(401).json({
//       success: false,
//       message: "Invalid token",
//     });
//   }
// };

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticate = (req: any, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    req.user = decoded;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
