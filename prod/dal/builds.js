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
exports.Build = void 0;
const Build_1 = require("../db/models/Build");
const items_1 = require("./items");
const champ_1 = require("./champ");
const getBuildsByUser = (user, opts) => __awaiter(void 0, void 0, void 0, function* () {
    const builds = yield Build_1.Build.findAll({ where: { userId: user }, raw: (opts === null || opts === void 0 ? void 0 : opts.raw) || false });
    return (yield Promise.all(builds.map(build => Build.fromId(build.buildId)))).filter((build) => !!build);
});
class Build {
    constructor(build) {
        var _a;
        this.user = build.user;
        this.champ = build.champ;
        this.items = (_a = build === null || build === void 0 ? void 0 : build.items) !== null && _a !== void 0 ? _a : [];
        this.buildId = build.dbObj.buildId;
        this.dbObj = build.dbObj;
        this.name = build.name;
    }
    static fromId(buildId) {
        return __awaiter(this, void 0, void 0, function* () {
            const build = yield Build_1.Build.findByPk(buildId);
            if (build) {
                const items = yield (0, items_1.getItemsInBuild)(buildId);
                const champ = yield champ_1.Champ.find(build.champId);
                const user = build.userId;
                if (!champ || !user)
                    return null;
                return new this({ user, champ, items, dbObj: build, name: build.buildName });
            }
            else {
                return null;
            }
        });
    }
    static create(build) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBuild = {
                userId: build.user,
                champId: build.champ.id,
                buildName: build.name,
            };
            const dbObj = yield Build_1.Build.create(newBuild);
            const itemsInBuild = build.items ? yield (0, items_1.addItemsToBuild)(dbObj.buildId, build.items) : undefined;
            if (itemsInBuild) {
                const itemsArray = yield (0, items_1.getItemsInBuild)(dbObj.buildId);
                if (itemsArray.length !== itemsInBuild.length) {
                    return null;
                }
                else {
                    return new this({ user: build.user, champ: build.champ, dbObj, items: itemsArray });
                }
            }
            else {
                const params = {
                    user: build.user,
                    champ: build.champ,
                    dbObj,
                    name: build.name,
                };
                return new this(params);
            }
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let needToUpdate = false;
                if (this.name !== this.dbObj.buildName && this.name) {
                    this.dbObj.buildName = this.name;
                    needToUpdate = true;
                }
                if (this.champ.id !== this.dbObj.champId) {
                    this.dbObj.champId = this.champ.id;
                    needToUpdate = true;
                }
                const dbItemsInBuild = yield (0, items_1.getItemsInBuild)(this.buildId);
                const items = this.items ? this.items : [];
                if (dbItemsInBuild.some((itemInB, i) => { var _a; return itemInB.id !== ((_a = items[i]) === null || _a === void 0 ? void 0 : _a.id); }) || items.length !== dbItemsInBuild.length) {
                    const newItems = yield (0, items_1.replaceItemsInBuild)(this.buildId, items);
                    if (newItems && newItems.length !== items.length) {
                        throw new Error('number of items in DB doesnt match object');
                    }
                }
                if (needToUpdate) {
                    yield this.dbObj.save();
                    return true;
                }
                else {
                    return true;
                }
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Build_1.ItemInBuild.destroy({ where: { buildId: this.buildId } });
                yield this.dbObj.destroy();
                return true;
            }
            catch (e) {
                console.error(e);
                return false;
            }
        });
    }
    toObject() {
        return ({
            buildName: this.name,
            buildId: this.buildId,
            champId: this.champ.id,
            champStats: this.champ.statsArray(),
            items: this.items.map(item => ({
                itemId: item.id,
                from: item.from,
                into: item.into,
                stats: item.statsArray()
            }))
        });
    }
}
exports.Build = Build;
exports.default = getBuildsByUser;
