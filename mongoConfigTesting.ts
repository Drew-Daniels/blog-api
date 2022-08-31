import mongoose from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from 'bcryptjs';

import { User } from "./models/userModel";
import { Post } from "./models/postModel";
import { SEED_USER_INFO } from './constants';

var mongoServer: MongoMemoryServer;

async function startupMongoServer() {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.on('error', e => {
    if (e.message.code === 'ETIMEDOUT') {
      console.log(e);
      mongoose.connect(mongoUri);
    }
    console.log(e);
  });
  const { firstName, lastName, username, password } = SEED_USER_INFO;
  try {
    // seed one user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      firstName,
      lastName,
      username,
      hash,
    });
    await user.save();
    // seed one post by seeded user
    const post = new Post({
      author: user,
      title: 'First post title!',
      body: 'First post body!',
    });
    await post.save();
    return { seedUserId:  user.id, seedPostId: post.id };
  } catch (err) {
    console.log(err);
  }
}

async function shutdownMongoServer() {
  if (mongoServer) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.drop();
    }
    await mongoose.connection.close();
    await mongoServer.stop();
  }
}

export {
  startupMongoServer,
  shutdownMongoServer,
}
