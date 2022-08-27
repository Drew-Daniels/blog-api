"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = require("./models/userModel");
passport_1.default.use(new passport_local_1.Strategy(function verify(username, password, cb) {
    userModel_1.User.findOne({ username }, function onUserSearched(err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
        // bcrypt.genSalt(10, function onSaltGenerated(err: Error, salt): void {
        //     if (err) { console.log(err); }
        //     bcrypt.hash(password, salt, function onHashGenerated(err: Error, hash: string): void {
        //       if (err) { console.log(err); }
        //         const user = new User({
        //           firstName
        //         })
        //     });
        // })
        bcryptjs_1.default.compare(password, user.hash, function onHashesCompared(err, result) {
            if (err) {
                return cb(err);
            }
            if (!result) {
                return cb(null, false);
            }
            return cb(null, user);
        });
    });
}));
