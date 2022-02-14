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
const { Champ, ChampStat } = require('../db/models/Champ');
const { Stat } = require('../db/models/Stat');
const updateChamps = (parsed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield ChampStat.destroy({ where: {}, truncate: false, cascade: false });
        yield Champ.destroy({ where: {}, truncate: false, cascade: true });
        const builtChamps = [];
        const builtChampStats = [];
        const stats = yield Stat.findAll();
        for (const champ of Object.values(parsed)) {
            const dbItem = Champ.build({
                champId: champ.id,
                champName: champ.name,
                title: champ.title,
                icon: champ.icon,
                resourceType: champ.resource
            });
            builtChamps.push(dbItem);
            for (const [type, mod] of Object.entries(champ.stats)) {
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
                if (stat === undefined) {
                    continue;
                }
                const champStat = ChampStat.build({
                    statId: stat.statId,
                    champId: champ.id,
                    flat: mod.flat,
                    percent: mod.percent,
                    perLevel: mod.perLevel,
                    percentPerLevel: mod.percentPerLevel
                });
                builtChampStats.push(champStat);
            }
        }
        yield Promise.all(builtChamps.map(champ => champ.save()));
        yield Promise.all(builtChampStats.map(stat => stat.save()));
        return true;
    }
    catch (e) {
        console.error(e);
        return false;
    }
});
module.exports = updateChamps;
