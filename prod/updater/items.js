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
const { Item, ItemInto } = require('../db/models/Item');
const { Stat, ItemStat } = require('../db/models/Stat');
const REMOVED = [4403, 7020, 7023];
const updateItems = (parsedItems) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ItemInto.destroy({ where: {}, truncate: false, cascade: false });
        yield ItemStat.destroy({ where: {}, truncate: false, cascade: false });
        yield Item.destroy({ where: {}, truncate: false, cascade: true });
        const builtItems = [];
        const builtItemStats = [];
        const builtItemIntos = [];
        const stats = yield Stat.findAll();
        for (const item of Object.values(parsedItems)) {
            const buildFrom = item.buildsFrom ? item.buildsFrom : item.builds_from;
            const buildInto = item.buildsInto ? item.buildsInto : item.builds_into;
            if (buildFrom.length === 0 && buildInto.length === 0) {
                continue;
            }
            const isMythic = item.passives.some((p) => p.mythic === true);
            const isLegendary = !isMythic &&
                buildInto.length === 0 &&
                !buildFrom.some((from) => from === 1001);
            const dbItem = Item.build({
                itemId: item.id,
                itemName: item.name,
                colloq: item.nicknames.join(';'),
                plaintext: item.simpleDescription,
                baseGold: 0,
                totalGold: item.shop.prices.total,
                legendary: isLegendary,
                mythic: isMythic,
                icon: item.icon
            });
            builtItems.push(dbItem);
            for (const into of buildInto) {
                if (REMOVED.some((num) => num === into) || isLegendary || isMythic) {
                    continue;
                }
                const obj = { fromItem: dbItem.itemId, intoItem: into };
                builtItemIntos.push(ItemInto.build(obj));
            }
            for (const [type, mod] of Object.entries(item.stats)) {
                const stat = stats.find((stat) => {
                    if (stat.statName === type) {
                        return true;
                    }
                    const aliases = stat.alias ? stat.alias.split(';') : [];
                    if (aliases.some((alias) => alias === type)) {
                        return true;
                    }
                    return false;
                });
                const itemStat = ItemStat.build({
                    itemId: dbItem.itemId,
                    statId: stat.statId,
                    flat: mod.flat,
                    percent: mod.percent,
                    perLevel: mod.perLevel,
                    percentPerLevel: mod.percentPerLevel,
                    percentBase: mod.percentBase,
                    percentBonus: mod.percentBonus,
                    unique: false,
                    named: ';',
                    passive: false,
                });
                builtItemStats.push(itemStat);
            }
            for (const p of item.passives) {
                const unique = p.unique;
                for (const [type, mod] of Object.entries(item.stats)) {
                    const stat = stats.find((stat) => {
                        if (stat.statName === type) {
                            return true;
                        }
                        const aliases = stat.alias ? stat.alias.split(';') : [];
                        if (aliases.some((alias) => alias === type)) {
                            return true;
                        }
                        return false;
                    });
                    const itemStat = ItemStat.build({
                        itemId: dbItem.itemId,
                        statId: stat.statId,
                        flat: mod.flat,
                        percent: mod.percent,
                        perLevel: mod.perLevel,
                        percentPerLevel: mod.percentPerLevel,
                        percentBase: mod.percentBase,
                        percentBonus: mod.percentBonus,
                        unique: unique,
                        named: p.name || ';',
                        passive: true,
                    });
                    builtItemStats.push(itemStat);
                }
            }
        }
        yield Promise.all(builtItems.map((item) => item.save()));
        yield Promise.all(builtItemIntos.map((item) => item.save()));
        const numeric = [
            'flat',
            'percent',
            'perLevel',
            'percentPerLevel',
            'percentBase',
            'percentBonus',
        ];
        const doneItemStats = [];
        for (const stat of builtItemStats) {
            const existing = doneItemStats.find((done) => {
                if (done.statId === stat.statId && done.itemId === stat.itemId) {
                    return true;
                }
                return false;
            });
            if (existing) {
                for (const name of numeric) {
                    existing.setDataValue(name, Math.max(existing.getDataValue(name), stat[name]));
                }
                yield existing.save();
            }
            else {
                yield stat.save();
                doneItemStats.push(stat);
            }
        }
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
});
module.exports = updateItems;
