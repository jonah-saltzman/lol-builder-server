"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.UserToken = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const User_1 = require("./User");
let UserToken = class UserToken extends sequelize_typescript_1.Model {
    invalidate() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setDataValue('valid', false);
                yield this.save();
                return true;
            }
            catch (_a) {
                return false;
            }
        });
    }
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], UserToken.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User, 'userId'),
    __metadata("design:type", User_1.User)
], UserToken.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], UserToken.prototype, "tokenString", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], UserToken.prototype, "valid", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", String)
], UserToken.prototype, "tokenId", void 0);
UserToken = __decorate([
    sequelize_typescript_1.Table
], UserToken);
exports.UserToken = UserToken;
