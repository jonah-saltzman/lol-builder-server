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
exports.newLocalUser = exports.findUserById = exports.findUserByEmail = void 0;
const User_1 = require("../db/models/User");
const sequelize_1 = require("sequelize");
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.User.findOne({
            where: { [sequelize_1.Op.and]: [{ email: email }, { deletionDate: null }] },
        });
    }
    catch (_a) {
        return null;
    }
});
exports.findUserByEmail = findUserByEmail;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield User_1.User.findByPk(id);
    }
    catch (_b) {
        return null;
    }
});
exports.findUserById = findUserById;
const newLocalUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (yield (0, exports.findUserByEmail)(email)) {
            return null;
        }
        const newUser = User_1.User.build({ email: email });
        if (newUser.newPassword(password)) {
            yield newUser.save();
            return newUser;
        }
        else {
            return null;
        }
    }
    catch (e) {
        console.error(e);
        return null;
    }
});
exports.newLocalUser = newLocalUser;
