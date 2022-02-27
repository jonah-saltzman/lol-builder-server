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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireToken = exports.InvalidTokenError = exports.Token = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const uuid_1 = require("./uuid");
const responder_1 = require("./responder");
const auth_1 = require("./dal/auth");
const users_1 = require("./dal/users");
class Secret {
    constructor(secret) {
        this.secret = secret || '';
        if (!secret) {
            throw new Error('Invalid secret');
        }
    }
    get string() {
        return this.secret;
    }
}
const SECRET = new Secret(process.env.JWT_SECRET);
class Token {
    constructor(user, source, type) {
        const now = new Date();
        const expires = source === 'native' ? null : new Date(now.getTime() + (1000 * 60 * 60 * 24 * 30));
        const data = {
            dbId: user.id,
            uuid: user.uuid,
            created: now,
            expires: expires,
            auth: type,
            source,
            tokenId: new uuid_1.UUID().toString()
        };
        this.user = user;
        this._data = data;
        this._token = (0, jsonwebtoken_1.sign)(this._data, SECRET.string);
        this._registered = false;
        this._tokenId = data.tokenId;
    }
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._registered) {
                return false;
            }
            try {
                const newToken = yield (0, auth_1.createToken)(this.user, this);
                if (newToken) {
                    this._registered = true;
                    this.userToken = newToken;
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    static validate(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = (0, jsonwebtoken_1.verify)(token, SECRET.string);
                if (decoded.expires && decoded.expires < new Date()) {
                    return [null, null];
                }
                try {
                    const userToken = yield (0, auth_1.findTokenByUuid)(decoded.tokenId);
                    const user = yield (0, users_1.findUserById)(decoded.dbId);
                    return [user, userToken];
                }
                catch (_a) {
                    return [null, null];
                }
            }
            catch (_b) {
                return [null, null];
            }
        });
    }
    get string() {
        return this._token;
    }
    get id() {
        return this._tokenId;
    }
}
exports.Token = Token;
class InvalidTokenError extends Error {
    constructor(message) {
        super(message || 'Invalid token');
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}
exports.InvalidTokenError = InvalidTokenError;
const requireToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenString = req.header('JWT');
    if (tokenString) {
        console.log('got token:');
        console.log('request: ', req.url);
        console.log(req.headers);
        const [user, token] = yield Token.validate(tokenString);
        if (user && token) {
            if (!token.valid) {
                return (0, responder_1.respond)(res, { message: 'Invalid session', status: 401 });
            }
            if (token.userId !== user.id) {
                return (0, responder_1.respond)(res, { message: 'Token does not match user', status: 401 });
            }
            req.user = user;
            req.tokenId = token.tokenId;
            req.token = token;
            next();
        }
        else {
            return (0, responder_1.respond)(res, { message: 'Invalid token', status: 401 });
        }
    }
    else {
        console.log('no token:');
        console.log('request: ', req.url);
        console.log(req.headers);
        return (0, responder_1.respond)(res, { message: 'Missing token', status: 401 });
    }
});
exports.requireToken = requireToken;
