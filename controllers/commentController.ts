import { Request, Response, NextFunction } from "express";
import { HydratedDocument } from 'mongoose';
import { IComment, Comment } from "../models/commentModel";

async function getComments(req: Request, res: Response, next: NextFunction): Promise<Array<HydratedDocument<IComment>>> {
  try {
        return Comment.find({ postId }).exec();
  } catch (err) {
        next(err);
  }
}

async function createComment() {

}

async function updateComment() {

}

async function deleteComment() {

}

const commentController = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
}

export default commentController;
