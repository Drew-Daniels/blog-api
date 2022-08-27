"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post('/', function handleLogin(req, res) {
    // verify token, logout user
    console.log(req);
    console.log(res);
});
router.delete('/', function handleLogout(req, res) {
    // verify token, logout user
    console.log(req);
    console.log(res);
});
exports.default = router;
