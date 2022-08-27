import { Schema, Types, model, Model, Document } from 'mongoose';

interface IComment extends Document {
  authorId: Types.ObjectId;
  postId: Types.ObjectId;
  body: string;
}

const CommentSchema = new Schema<IComment>({
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  postId: { type: Schema.Types.ObjectId, ref: 'Post' },
  body: String,
}, { timestamps: true });

const Comment: Model<IComment> = model<IComment>('Comment', CommentSchema);

export {
  IComment,
  Comment,
}
