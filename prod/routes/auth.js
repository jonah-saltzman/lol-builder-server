"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../dal/users");
const responder_1 = require("../responder");
const tokens_1 = require("../tokens");
const authRouter = express_1.default.Router();
authRouter.get('/signout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield req.token.invalidate()) {
        return (0, responder_1.respond)(res, { message: `${req.user.email} signed out.`, status: 200 });
    }
    (0, responder_1.respond)(res, null);
}));
authRouter.patch('/changepass', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hit changepass');
    try {
        console.log('hit changepass');
        console.log(req.body);
        if (!req.body.oldPass || !req.body.newPass)
            throw 400;
        if (req.user.changePassword(req.body.oldPass, req.body.newPass)) {
            return (0, responder_1.respond)(res, { message: 'Password changed successfully', status: 200 });
        }
        else {
            throw 401;
        }
    }
    catch (e) {
        if (typeof e === 'number')
            return (0, responder_1.respond)(res, { status: e });
        (0, responder_1.respond)(res, null);
    }
}));
authRouter.use((req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return (0, responder_1.respond)(res, { message: 'Missing parameters', status: 401 });
    }
    req.email = req.body.email;
    req.password = req.body.password;
    next();
});
authRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield (0, users_1.findUserByEmail)(req.email);
    if (user) {
        return (0, responder_1.respond)(res, { message: 'Account exists', status: 409 });
    }
    user = yield (0, users_1.newLocalUser)(req.email, req.password);
    if (user) {
        return (0, responder_1.respond)(res, {
            message: 'Account created',
            data: { email: user.email },
            status: 201,
        });
    }
    return (0, responder_1.respond)(res, null);
}));
authRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, users_1.findUserByEmail)(req.email);
    if (!user) {
        return (0, responder_1.respond)(res, { message: 'User not found', status: 404 });
    }
    else {
        if (!user.checkPassword(req.password)) {
            return (0, responder_1.respond)(res, { message: 'Invalid password', status: 401 });
        }
        const token = new tokens_1.Token(user, 'web', 'local');
        yield token.register();
        return (0, responder_1.respond)(res, {
            message: `${user.email} signed in.`,
            data: { token: token.string },
            status: 200,
        });
    }
}));
exports.default = authRouter;
