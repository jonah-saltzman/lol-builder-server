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
exports.Champ = void 0;
const Champ_1 = require("../db/models/Champ");
const interfaces_1 = require("../interfaces");
const config_1 = require("../db/config");
class Champ extends interfaces_1.Stats {
    constructor(name, id, stats, dbItem) {
        super(stats);
        this.name = name;
        this.id = id;
        this.dbObj = dbItem;
        this.stats = stats;
    }
    static find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id === 'number') {
                const cachedChamp = config_1.champCache.get(id);
                if (cachedChamp) {
                    return cachedChamp;
                }
            }
            const champ = typeof id === 'string'
                ? yield Champ_1.Champ.findOne({ where: { name: id } })
                : yield Champ_1.Champ.findByPk(id);
            if (!champ) {
                return null;
            }
            else {
                const dbStats = yield Champ_1.ChampStat.findAll({ where: { champId: champ.champId } });
                const newChamp = new this(champ.champName, champ.champId, dbStats, champ);
                config_1.champCache.set(newChamp.id, newChamp);
                return newChamp;
            }
        });
    }
    statsArray() {
        // const entries = {...this}
        // return Object.entries(entries).map(([name, mods]) => ({
        //     statName: name,
        //     mods: mods as Mods
        // })).filter(obj => !(obj.statName in ['id', 'name', 'dbObj', 'stats']))
        return this.stats;
    }
}
exports.Champ = Champ;
