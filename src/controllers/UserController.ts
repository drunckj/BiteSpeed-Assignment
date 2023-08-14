import { Request, Response } from 'express';
import { identifyUserService } from '../services/UserService';
import { clearDatabase,getAllData } from '../services/DatabaseService';
export const identifyUser = async (req: Request, res: Response) => {
  const message=await identifyUserService(req.body);
  res.json(message);
};
export const clearAll=async (req: Request, res: Response) => {
  await clearDatabase();
  res.json({message:"database cleared"})
  
}
export const getAll=async (req: Request, res: Response) => {
  const message= await getAllData();
  res.json(message);
  
}
