import { Request, Response, NextFunction } from "express";
import { Comment } from "../models/commentModel";

async function getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ postId }).lean();
    res.send({ comments });
  } catch (err) {
      next(err);
  }
}

async function createComment(req: Request, res: Response, next: NextFunction) {
  const { postId } = req.params;
  const { body } = req.body;
  try {
    const comment = await Comment.create({
      author: req.user!._id,
      post: postId,
      body,
    });
    console.log(`Comment added: ${comment}`)
    res.send({ comment })
  } catch (err) {
    next(err);
  }
}

async function updateComment(req: Request, res: Response, next: NextFunction) {
  const { commentId } = req.params;
  const { body } = req.body;
  try {
    const comment = await Comment.findByIdAndUpdate(commentId, { body }, { returnDocument: 'after' })
    console.log(`Comment ${commentId} has been updated: ${comment}`);
    res.send({ comment });
  } catch (err) {
    next(err);
  }
}

async function deleteComment(req: Request, res: Response, next: NextFunction) {
  const { commentId } = req.params;
  try {
    await Comment.findByIdAndDelete(commentId);
    console.log(`Comment ${commentId} deleted`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

const commentController = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
}

export default commentController;
