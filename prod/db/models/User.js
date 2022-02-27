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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("../../uuid");
const UserToken_1 = require("./UserToken");
const Build_1 = require("./Build");
let User = class User extends sequelize_typescript_1.Model {
    checkPassword(pass) {
        return bcrypt_1.default.compareSync(pass, this.getDataValue('password'));
    }
    changePassword(oldPass, newPass) {
        if (bcrypt_1.default.compareSync(oldPass, this.getDataValue('password'))) {
            this.setDataValue('password', bcrypt_1.default.hashSync(newPass, 10));
            this.save();
            return true;
        }
        return false;
    }
    newPassword(pass) {
        if (this.getDataValue('password')) {
            return false;
        }
        this.setDataValue('password', bcrypt_1.default.hashSync(pass, 10));
        return true;
    }
    static addUuidHook(user) {
        if (!user.getDataValue('uuid')) {
            user.setDataValue('uuid', new uuid_1.UUID().toString());
        }
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.CreatedAt,
    __metadata("design:type", Date)
], User.prototype, "creationDate", void 0);
__decorate([
    sequelize_typescript_1.UpdatedAt,
    __metadata("design:type", Date)
], User.prototype, "updatedOn", void 0);
__decorate([
    sequelize_typescript_1.DeletedAt,
    __metadata("design:type", Date)
], User.prototype, "deletionDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)(sequelize_typescript_1.DataType.TEXT),
    __metadata("design:type", uuid_1.UUID)
], User.prototype, "uuid", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => UserToken_1.UserToken, 'userId'),
    __metadata("design:type", Array)
], User.prototype, "tokens", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => Build_1.Build, 'buildId'),
    __metadata("design:type", Array)
], User.prototype, "builds", void 0);
__decorate([
    (0, sequelize_typescript_1.BeforeSave)({ name: 'addUuidHook' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", void 0)
], User, "addUuidHook", null);
User = __decorate([
    sequelize_typescript_1.Table
], User);
exports.User = User;
