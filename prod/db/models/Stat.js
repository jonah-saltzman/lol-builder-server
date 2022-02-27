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
exports.ItemStat = exports.Stat = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Item_1 = require("./Item");
let Stat = class Stat extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Stat.prototype, "statId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Stat.prototype, "statName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Stat.prototype, "alias", void 0);
Stat = __decorate([
    (0, sequelize_typescript_1.Table)({ paranoid: false })
], Stat);
exports.Stat = Stat;
let ItemStat = class ItemStat extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Stat),
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", Number)
], ItemStat.prototype, "statId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Item_1.Item),
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", Number)
], ItemStat.prototype, "itemId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "flat", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "percent", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "perLevel", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "percentPerLevel", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "percentBase", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ItemStat.prototype, "percentBonus", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ItemStat.prototype, "unique", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", String)
], ItemStat.prototype, "named", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], ItemStat.prototype, "passive", void 0);
ItemStat = __decorate([
    (0, sequelize_typescript_1.Table)({ updatedAt: false, createdAt: false, paranoid: false })
], ItemStat);
exports.ItemStat = ItemStat;
// @Table
// export class ChampStat extends Model {
// }
