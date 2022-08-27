import { Request, Response, NextFunction } from "express";
import { Post } from '../models/postModel';
import { User } from "../models/userModel";

async function getPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
        const posts = await Post.find().exec();
        // hydrate each post with comments
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

async function getUserPosts(req: Request, res: Response, next: NextFunction): Promise<void> {

}

async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  // validate authenticated
  // save in db
  // send response code and return new post
}

async function updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  // validate authenticated
  // save in db
  // send response code and return post
}

async function deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  // validate authenticated
  // save in db
  // send response code and return post
}

const postController = {
  getPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
}

export default postController;
