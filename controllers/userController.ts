import { Request, Response, NextFunction } from "express";
import { User } from '../models/userModel';
import { Post } from "../models/postModel";

async function getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const users = User.find().exec();
        res.status(200).json({ users });
    } catch (err) {
        next(err);
    }
}

async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.params["userId"]) {
        try {
            const user = User.findById(req.params["userId"]).exec();
            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    }
    res.status(400).end();
}

async function getUserPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.params['userId']) {
        try {
            const posts = Post.find({ userId: req.params["userId"] }).exec();
            res.status(200).json({ posts });
        } catch (err) {
            next(err);
        }
    }
    res.status(400).end();
}

export default {
    getUsers,
    getUser,
    getUserPosts,
}