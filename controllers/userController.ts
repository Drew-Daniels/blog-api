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

async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { firstName, lastName, username, password } = req.body;
    // hash password
    // save in db
    // return response code and new user data
}

async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { firstName, lastName, username, password } = req.body;
    // check authenticated
    // save in db
    // return response code and new user data
}

async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    // check authenticated
    // delete from db
    // return response code
}

const userController = {
    getUsers,
    getUser,
    getUserPosts,
    createUser,
    updateUser,
    deleteUser,
}

export default userController;
