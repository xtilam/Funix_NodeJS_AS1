import { RequestHandler } from "express";
import { UserTokenModel } from "../model/UserTokenModel";

export const authMiddware: RequestHandler = async (req, res, next) => {
  const authError = () => res.status(401).json({ message: "Unauthorized" });

  const token = req.headers.authorization;
  if (!token) return authError();
  if (!(await UserTokenModel.getUser(token))) return authError();
  
  next();
};
