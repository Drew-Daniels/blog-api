import { Schema, model, Model, Document, Types } from 'mongoose';

interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  body: string;
  isPublished: boolean;
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  isPublished: { type: String, default: false, required: true },
}, { timestamps: true });

const Post: Model<IPost> = model<IPost>('Post', PostSchema);

export {
  IPost,
  Post,
}