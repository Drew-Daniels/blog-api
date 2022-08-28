import { Schema, model, Model, Document, Types } from 'mongoose';

interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  body: string;
  isPublished: boolean;
}

const PostSchema = new Schema<IPost>({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: String,
  body: String,
  isPublished: Boolean,
}, { timestamps: true });

const Post: Model<IPost> = model<IPost>('Post', PostSchema);

export {
  IPost,
  Post,
}