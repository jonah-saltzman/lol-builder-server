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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInBuild = exports.Build = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Item_1 = require("./Item");
const User_1 = require("./User");
let Build = class Build extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Build.prototype, "buildId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => User_1.User),
    __metadata("design:type", User_1.User)
], Build.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => User_1.User),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Build.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Build.prototype, "champId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Build.prototype, "buildName", void 0);
Build = __decorate([
    sequelize_typescript_1.Table
], Build);
exports.Build = Build;
let ItemInBuild = class ItemInBuild extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Build),
    (0, sequelize_typescript_1.Column)({ autoIncrement: false, primaryKey: true }),
    __metadata("design:type", Number)
], ItemInBuild.prototype, "buildId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Item_1.Item),
    (0, sequelize_typescript_1.Column)({ autoIncrement: false, primaryKey: true }),
    __metadata("design:type", Number)
], ItemInBuild.prototype, "itemId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemInBuild.prototype, "position", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ItemInBuild.prototype, "isPath", void 0);
ItemInBuild = __decorate([
    (0, sequelize_typescript_1.Table)({ updatedAt: false, createdAt: false, paranoid: false, deletedAt: false })
], ItemInBuild);
exports.ItemInBuild = ItemInBuild;
