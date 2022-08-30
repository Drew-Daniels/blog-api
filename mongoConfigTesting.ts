import mongoose from 'mongoose';
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from 'bcryptjs';

import { User } from "./models/userModel";
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

  // mongoose.connection.once('open', () => {
  //   console.log(`MongoDB successfully connected to ${mongoUri}`);
  // });
  // move this into a separate function
  bcrypt.genSalt(10, function onSaltGenerated(err, salt) {
    if (err) { console.log(err); }
    const { firstName, lastName, username, password } = SEED_USER_INFO;
    bcrypt.hash(password, salt, function onHashGenerated(err, hash) {
      if (err) { console.log(err) }
      // create new user
      const user = new User({
        firstName,
        lastName,
        username,
        hash,
      });
      user.save(function onUserSaved(err) {
        if (err) { return console.log(err); }
      });
    });
  });
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
