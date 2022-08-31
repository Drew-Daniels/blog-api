import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";

import { User } from '../models/userModel';
import { ObjectId } from 'mongodb';

async function getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await User.find();
    res.send({ users });
  } catch (err) {
     next(err);
  }
}

async function getUser(req: Request, res: Response, next: NextFunction) {
  if (!ObjectId.isValid(req.params['userId'])) { return res.sendStatus(400); } // invalid BSON string
  try {
    const user = await User.findById(req.params['userId']);
    if (!user) return res.sendStatus(404);
    res.send({ user });
  } catch (err) {
    next(err);
  }
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, username, password } = req.body;
  const userExists = !!await User.count({ username });
  if (userExists) {
    return res.status(409).send({ error: 'A user with that username already exists' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
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
  } catch (err) {
    next(err);
  }
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const { userId } = req.params;
  if (!ObjectId.isValid(userId)) { return res.sendStatus(400); }
  const userExists = !! await User.findById(userId);
  if (!userExists) { return res.sendStatus(404); }
  const { firstName, lastName, username, password, isAuthor } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
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
  createUser,
  updateUser,
  deleteUser,
}

export default userController;
