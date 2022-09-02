import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { IPost, Post } from '../models/postModel';
import { IComment, Comment } from '../models/commentModel';
import {ObjectId} from "mongodb";
import { User } from "../models/userModel";

interface ILeanPost extends IPost {
  _id: Types.ObjectId;
}

interface PostWithComments extends ILeanPost {
  comments: Array<IComment & { _id: Types.ObjectId } >
}

async function getPosts(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const postsMinusComments = await Post.find().lean();
    const postsPlusComments = await Promise.all(postsMinusComments.map(async function supplyPostWithComments(post: IPost): Promise<PostWithComments> {
      const comments = await Comment.find({ post: post._id }).lean();
      return { ...post, comments: comments }
    }));
    res.send({ posts: postsPlusComments });
  } catch (err) {
      next(err);
  }
}

async function getPost(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params['postId'])) return res.sendStatus(400);
  try {
    const post = await Post.findById(req.params['postId']);
    if (!post) return res.sendStatus(404);
    // TODO: hydrate w/ comments
    return res.status(200).json({ post });
  } catch (err) {
      next(err);
  }
}

async function getUserPosts(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  if (!ObjectId.isValid(req.params['userId'])) return res.sendStatus(400); // invalid BSON string
  const userExists = await User.findById(userId);
  if (!userExists) return res.sendStatus(404);
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

async function deletePost(req: Request, res: Response, next: NextFunction) {
  const { postId } = req.params;
  if (!ObjectId.isValid(postId)) return res.sendStatus(400);
  try {
    const postExists = !! await Post.findById(postId);
    if (!postExists) return res.sendStatus(404);
    await Post.findByIdAndDelete(postId);
    console.log(`Post ${postId} has been deleted`);
    return res.sendStatus(200);
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
