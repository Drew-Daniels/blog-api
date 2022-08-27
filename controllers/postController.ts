import { Request, Response, NextFunction } from "express";
import { Post } from '../models/postModel';

async function getPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const posts = Post.find().exec();
        res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
}

async function getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    if (req.params['postId']) {
        try {
            const post = Post.findById(req.params['postId']).exec();
            res.status(200).json({ post });
        } catch (err) {
            next(err);
        }
    }
    res.status(400).end();
}

export {
    getPosts,
    getPost,
}