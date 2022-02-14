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
exports.ChampStat = exports.Champ = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Stat_1 = require("./Stat");
let Champ = class Champ extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Champ.prototype, "champId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Champ.prototype, "champName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Champ.prototype, "title", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Champ.prototype, "icon", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Champ.prototype, "resourceType", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ChampStat),
    __metadata("design:type", Array)
], Champ.prototype, "stats", void 0);
Champ = __decorate([
    (0, sequelize_typescript_1.Table)({ updatedAt: false, createdAt: false, paranoid: false })
], Champ);
exports.Champ = Champ;
let ChampStat = class ChampStat extends sequelize_typescript_1.Model {
};
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Stat_1.Stat),
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", Number)
], ChampStat.prototype, "statId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => Champ),
    (0, sequelize_typescript_1.Column)({ primaryKey: true }),
    __metadata("design:type", Number)
], ChampStat.prototype, "champId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChampStat.prototype, "flat", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChampStat.prototype, "percent", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChampStat.prototype, "perLevel", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], ChampStat.prototype, "percentPerLevel", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => Champ, 'champId'),
    __metadata("design:type", Champ)
], ChampStat.prototype, "champ", void 0);
ChampStat = __decorate([
    (0, sequelize_typescript_1.Table)({ updatedAt: false, createdAt: false, paranoid: false })
], ChampStat);
exports.ChampStat = ChampStat;
