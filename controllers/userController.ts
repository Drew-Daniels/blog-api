import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import { User } from '../models/userModel';
import { Post } from "../models/postModel";

async function getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (err) {
     next(err);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.params["userId"]) {
    try {
      const user = await User.findById(req.params["userId"]);
      res.send({ user });
    } catch (err) {
      next(err);
    }
  } else {
    res.sendStatus(400);
  }
}

async function getUserPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (req.params['userId']) {
    try {
      const posts = await Post.find({ userId: req.params["userId"] });
      res.send({ posts });
    } catch (err) {
        next(err);
    }
  } else {
    res.sendStatus(400);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, username, password } = req.body;
  const userExists = !!await User.count({ username });
  if (userExists) {
    return res.status(409).send({ error: 'A user with that username already exists' });
  }
  // hash pwd
  bcrypt.genSalt(10, function onSaltGenerated(err, salt) {
    if (err) { next(err); }
    bcrypt.hash(password, salt, function onHashGenerated(err, hash) {
      if (err) { next(err) }
      // create new user
      const user = new User({
        firstName,
        lastName,
        username,
        hash,
      });
      user.save(function onUserSaved(err) {
        if (err) { return next(err); }
        res.send({ user });
      });
    });
  });
}

async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  const { firstName, lastName, username, password, isAuthor } = req.body;
  bcrypt.genSalt(10, function onSaltGenerated(err, salt) {
    if (err) { next(err); }
    bcrypt.hash(password, salt, async function onHashGenerated(err, hash) {
      if (err) { next(err); }
      try {
        const user = await User.findByIdAndUpdate(userId, {
          firstName,
          lastName,
          username,
          hash,
          isAuthor,
        });
        console.log(`User ${userId} has been updated: ${username} - ${lastName}, ${firstName}`);
        res.send({ user });
      } catch (err) {
        next(err);
      }
    });
  });
}

async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { userId } = req.params;
  try {
    await User.findByIdAndDelete(userId);
    console.log(`User ${userId} has been deleted`);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

const userController = {
  getUsers,
  getUser,
  getUserPosts,
  createUser,
  updateUser,
  deleteUser,
}

export default userController;
