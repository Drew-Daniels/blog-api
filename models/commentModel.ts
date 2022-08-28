import { Schema, Types, model, Model, Document } from 'mongoose';

interface IComment extends Document {
  author: Types.ObjectId;
  post: Types.ObjectId;
  body: string;
}

const CommentSchema = new Schema<IComment>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  body: { type: String, required: true },
}, { timestamps: true });

const Comment: Model<IComment> = model<IComment>('Comment', CommentSchema);

export {
  IComment,
  Comment,
}
