import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { IPost, Post } from '../models/postModel';
import { IComment, Comment } from '../models/commentModel';

interface ILeanPost extends IPost {
  _id: Types.ObjectId;
}

interface PostWithComments extends ILeanPost {
  comments: Array<IComment & { _id: Types.ObjectId } >
}

async function getPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const postsMinusComments = await Post.find().lean();
    // TODO: Create an interface that
    const postsPlusComments = await Promise.all(postsMinusComments.map(async function supplyPostWithComments(post: IPost): Promise<PostWithComments> {
      const comments = await Comment.find({ post: post._id }).lean();
      return { ...post, comments: comments }
    }));
    res.send({ posts: postsPlusComments });
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
    const posts = await Post.find({ author: userId });
    res.send({ posts });
  } catch (err) {
    next(err);
  }
}

async function createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { title, body } = req.body;
  try {
    const post = await Post.create({
      author: req.user!._id,
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
    res.send({ post });
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
