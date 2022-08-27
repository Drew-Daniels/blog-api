import { Request, Response, NextFunction } from "express";
import User from '../models/userModel';

async function getUsers(req: Request, res: Response, next: NextFunction): Promise<typeof User> {
    return User.find().exec();
}

async function getUser(req: Request, res: Response, next: NextFunction): Promise<typeof User> {
    return User.findById(userId).exec();
}

export default {
    getUsers,
    getUser,
}