"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const respond = (res, payload) => {
    if (!payload || payload.status === 500) {
        res.status(500);
        res.json({ message: 'Unknown server error' });
        return;
    }
    if (payload.redirect) {
        res.redirect(payload.redirect);
        return;
    }
    res.status(payload.status);
    res.json(new Res(payload));
};
exports.respond = respond;
const Res = function Res(payload) {
    if (payload.message) {
        this.message = payload.message;
    }
    if (payload.data) {
        this.data = payload.data;
    }
    return this;
};
