"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onValidated = void 0;
const express_validator_1 = require("express-validator");
function onValidated(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }
    next();
}
exports.onValidated = onValidated;
