"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const userModel_1 = require("./models/userModel");
var JwtStrategy = passport_jwt_1.default.Strategy;
var ExtractJwt = passport_jwt_1.default.ExtractJwt;
passport_1.default.use(new passport_local_1.Strategy(function verify(username, password, cb) {
    userModel_1.User.findOne({ username }, function onUserSearched(err, user) {
        if (err) {
            return cb(err);
        }
        if (!user) {
            return cb(null, false);
        }
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
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env['SECRET'],
}, function verify(jwtPayload, cb) {
    return userModel_1.User.findById(jwtPayload.userId)
        .then(user => {
        if (!user) {
            return cb(null, false);
        }
        return cb(null, user);
    })
        .catch(err => {
        return cb(err);
    });
}));
exports.default = passport_1.default;
