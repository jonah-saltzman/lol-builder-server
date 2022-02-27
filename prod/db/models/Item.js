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
exports.ItemInto = exports.Item = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let Item = class Item extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Item.prototype, "itemId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Item.prototype, "itemName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Item.prototype, "colloq", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Item.prototype, "plaintext", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Item.prototype, "baseGold", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Item.prototype, "totalGold", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ItemInto, { foreignKey: 'fromItem' }),
    __metadata("design:type", Number)
], Item.prototype, "buildsInto", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Item.prototype, "legendary", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], Item.prototype, "mythic", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Item.prototype, "icon", void 0);
Item = __decorate([
    (0, sequelize_typescript_1.Table)({ paranoid: false, updatedAt: false, createdAt: false })
], Item);
exports.Item = Item;
let ItemInto = class ItemInto extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Item),
    (0, sequelize_typescript_1.Column)({ autoIncrement: false, primaryKey: true }),
    __metadata("design:type", Number)
], ItemInto.prototype, "fromItem", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Item),
    (0, sequelize_typescript_1.Column)({ autoIncrement: false, primaryKey: true }),
    __metadata("design:type", Number)
], ItemInto.prototype, "intoItem", void 0);
ItemInto = __decorate([
    (0, sequelize_typescript_1.Table)({ updatedAt: false, createdAt: false, paranoid: false })
], ItemInto);
exports.ItemInto = ItemInto;
