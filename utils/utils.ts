import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

function onValidated(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
// TODO: Figure out type annotation for this
function passwordValidator(value: string, { req }): Error | boolean {
  if (value !== req.body.password) {
    throw new Error('Password confirmation does not match password');
  }
  return true;
}

export {
  onValidated,
  passwordValidator,
}