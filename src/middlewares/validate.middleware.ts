// import { Request, Response, NextFunction } from "express";

// export const validate = (schema: any) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       schema.parse(req.body);
//       next();
//     } catch (error: any) {
//       return res.status(400).json({
//         success: false,
//         message: error.errors[0].message,
//       });
//     }
//   };
// };

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error?.issues?.[0]?.message || "Validation failed",
      });
    }
  };
};