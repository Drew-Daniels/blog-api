import { Request, Response, NextFunction } from "express";
import { Post } from '../models/postModel';

async function getPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const posts = await Post.find();
    // TODO: hydrate w/ comments
    res.status(200).json({ posts });
  } catch (err) {
      next(err);
  }
}

async function getPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.params['postId']) {
    try {
      const post = await Post.findById(req.params['postId']);
      // TODO: hydrate w/ comments
      res.status(200).json({ post });
    } catch (err) {
        next(err);
    }
  }
  res.status(400).end();
}

async function getUserPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ author: userId })
    res.send({ posts });
  } catch (err) {
    next(err);
  }
}

async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { title, body, author } = req.body;
  try {
    const post = await Post.create({
      author,
      title,
      body,
    });
    post.save(function onPostSaved(err) {
      if (err) { return next(err); }
      console.log('New Post saved: ', post);
      res.send({ post });
    });
  } catch (err) {
    return next(err);
  }
}

async function updatePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { postId } = req.params;
  const { title, body } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(postId, {title, body }, { returnDocument: 'after' });
    console.log(`Post ${postId} has been updated: ${post}`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function deletePost(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { postId } = req.params;
  try {
    await Post.findByIdAndDelete(postId);
    console.log(`Post ${postId} has been deleted`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
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
