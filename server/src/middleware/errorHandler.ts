import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../../shared/types";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error:", err.message);
  console.error("Stack:", err.stack);

  const response: ApiResponse<null> = {
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  };

  res.status(500).json(response);
};
