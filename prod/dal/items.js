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
exports.itemFilter = exports.replaceItemsInBuild = exports.addItemsToBuild = exports.getItemsInBuild = exports.Item = void 0;
const Item_1 = require("../db/models/Item");
const Stat_1 = require("../db/models/Stat");
const interfaces_1 = require("../interfaces");
const Build_1 = require("../db/models/Build");
const config_1 = require("../db/config");
class Item extends interfaces_1.Stats {
    constructor(name, id, stats, from, into, dbItem, icon) {
        super(stats);
        this.name = name;
        this.id = id;
        this.from = from;
        this.into = into;
        this.dbObj = dbItem;
        this.stats = stats;
        this.icon = icon;
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const item = typeof id === 'string'
                ? yield Item_1.Item.findOne({ where: { name: id } })
                : yield Item_1.Item.findByPk(id);
            if (!item) {
                return null;
            }
            else {
                const dbStats = yield Stat_1.ItemStat.findAll({ where: { itemId: item.itemId } });
                const into = (yield Item_1.ItemInto.findAll({ where: { fromItem: item.itemId } })).map((into) => into.intoItem);
                const from = (yield Item_1.ItemInto.findAll({ where: { intoItem: item.itemId } })).map((into) => into.fromItem);
                return new this(item.itemName, item.itemId, dbStats, from, into, item, item.icon);
            }
        });
    }
    statsArray() {
        // const entries = { ...this }
        // return Object.entries(entries)
        // 	.map(([name, mods]) => ({
        // 		statName: name,
        // 		mods: mods as Mods,
        // 	}))
        // 	.filter((obj) => !(obj.statName in ['id', 'name', 'from', 'into', 'dbObj']))
        return this.stats;
    }
}
exports.Item = Item;
const getItemsInBuild = (buildId) => __awaiter(void 0, void 0, void 0, function* () {
    const itemInBuilds = yield Build_1.ItemInBuild.findAll({ where: { buildId } });
    itemInBuilds.sort((itemA, itemB) => itemA.position - itemB.position);
    const initial = [];
    const cachedArray = itemInBuilds.reduce((arr, dbObj) => {
        const item = config_1.itemCache.get(dbObj.itemId);
        if (item) {
            arr.push(item);
        }
        return arr;
    }, initial);
    if (cachedArray.length === itemInBuilds.length) {
        console.log('returning cached items');
        return cachedArray;
    }
    const items = (yield Promise.all(itemInBuilds.map(id => Item.find(id.itemId)))).filter(exports.itemFilter);
    const set = config_1.itemCache.mset(items.map((item) => ({ key: item.id, val: item })));
    if (set) {
        console.log(`added ${items.length} items to the cache`);
    }
    else {
        console.log('error adding items to cache');
    }
    return items;
});
exports.getItemsInBuild = getItemsInBuild;
const addItemsToBuild = (buildId, items) => __awaiter(void 0, void 0, void 0, function* () {
    const objArray = items.map((item, i) => ({ buildId, itemId: item.id, position: i, isPath: false }));
    const itemsInBuild = yield Build_1.ItemInBuild.bulkCreate(objArray);
    console.log(`added ${itemsInBuild.length} items to build ${buildId}:`);
    console.log(itemsInBuild);
    return itemsInBuild;
});
exports.addItemsToBuild = addItemsToBuild;
const replaceItemsInBuild = (buildId, items) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleted = yield Build_1.ItemInBuild.destroy({ where: { buildId } });
        console.log(`deleted ${deleted} iteminbuilds`);
        if (items.length > 0) {
            const newItems = yield (0, exports.addItemsToBuild)(buildId, items);
            if (newItems && newItems.length === items.length) {
                return newItems;
            }
            else {
                return null;
            }
        }
        else {
            return [];
        }
    }
    catch (e) {
        console.log('caught error in replaceItems');
        console.error(e);
        return null;
    }
});
exports.replaceItemsInBuild = replaceItemsInBuild;
const itemFilter = (item) => {
    return !!item;
};
exports.itemFilter = itemFilter;
