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
exports.findTokenByUuid = exports.createToken = void 0;
const UserToken_1 = require("../db/models/UserToken");
const createToken = (user, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newToken = yield UserToken_1.UserToken.create({
            user: user,
            tokenString: token.string,
            userId: user.id,
            valid: true,
            tokenId: token.id.toString(),
        });
        return newToken;
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.createToken = createToken;
const findTokenByUuid = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield UserToken_1.UserToken.findOne({ where: { tokenId: token } });
    }
    catch (_a) {
        return null;
    }
});
exports.findTokenByUuid = findTokenByUuid;
