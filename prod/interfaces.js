"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stats = exports.Modifiers = void 0;
const config_1 = require("./db/config");
const Champ_1 = require("./db/models/Champ");
var Modifiers;
(function (Modifiers) {
    Modifiers["FLAT"] = "flat";
    Modifiers["PERCENT"] = "percent";
    Modifiers["perLevel"] = "perLevel";
    Modifiers["PPL"] = "percentPerLevel";
})(Modifiers = exports.Modifiers || (exports.Modifiers = {}));
var statName;
(function (statName) {
    statName["AP"] = "abilityPower";
    statName["armor"] = "armor";
    statName["AD"] = "attackDamage";
    statName["AS"] = "attackSpeed";
    statName["AH"] = "abilityHaste";
    statName["critChance"] = "criticalStrikeChance";
    statName["HSP"] = "healAndShieldPower";
    statName["health"] = "health";
    statName["HR"] = "healthRegen";
    statName["lethality"] = "lethality";
    statName["LS"] = "lifesteal";
    statName["MP"] = "magicPenetration";
    statName["MR"] = "magicResistance";
    statName["mana"] = "mana";
    statName["manaRegen"] = "manaRegen";
    statName["MS"] = "movespeed";
    statName["OV"] = "omnivamp";
    statName["tenacity"] = "tenacity";
    statName["armorPen"] = "armorPenetration";
})(statName || (statName = {}));
class Stats {
    constructor(stats) {
        var _a;
        const isChamp = typeof stats[0] === typeof Champ_1.ChampStat;
        const allStats = config_1.openCache.get('stats');
        if (!allStats) {
            throw new Error('couldnt get stats');
        }
        for (const stat of stats) {
            const name = (_a = allStats.find(prop => prop.statId === stat.statId)) === null || _a === void 0 ? void 0 : _a.statName;
            const mods = {
                flat: stat.flat,
                percent: stat.percent,
                perLevel: stat.perLevel,
                percentPerLevel: stat.percentPerLevel
            };
            switch (name) {
                case 'abilityPower':
                    this.AP = mods;
                    break;
                case 'armor':
                    this.armor = mods;
                    break;
                case 'armorPenetration':
                    this.armorPen = mods;
                    break;
                case 'attackDamage':
                    this.AD = mods;
                    break;
                case 'attackSpeed':
                    this.AS = mods;
                    break;
                case 'abilityHaste':
                    this.AH = mods;
                    break;
                case 'criticalStrikeChance':
                    this.critChance = mods;
                    break;
                case 'healAndShieldPower':
                    this.HSP = mods;
                    break;
                case 'health':
                    this.health = mods;
                    break;
                case 'healthRegen':
                    this.HR = mods;
                    break;
                case 'lethality':
                    this.lethality = mods;
                    break;
                case 'lifesteal':
                    this.LS = mods;
                    break;
                case 'magicPenetration':
                    this.MP = mods;
                    break;
                case 'magicResistance':
                    this.MR = mods;
                    break;
                case 'mana':
                    this.mana = mods;
                    break;
                case 'manaRegen':
                    this.manaRegen = mods;
                    break;
                case 'movespeed':
                    this.MS = mods;
                    break;
                case 'omnivamp':
                    this.OV = mods;
                    break;
                case 'tenacity':
                    this.tenacity = mods;
                    break;
                default:
                    console.log('FAILED TO ADD STAT: ', name);
                    break;
            }
        }
    }
}
exports.Stats = Stats;
Stats._AP = 'abilityPower';
Stats._armor = 'armor';
Stats._armorPen = 'armorPenetration';
Stats._AD = 'attackDamage';
Stats._AS = 'attackSpeed';
Stats._AH = 'abilityHaste';
Stats._critChance = 'criticalStrikeChance';
Stats._HSP = 'healAndShieldPower';
Stats._health = 'health';
Stats._HR = 'healthRegen';
Stats._lethality = 'lethality';
Stats._LS = 'lifesteal';
Stats._MP = 'magicPenetration';
Stats._MR = 'magicResistance';
Stats._mana = 'mana';
Stats._manaRegen = 'manaRegen';
Stats._MS = 'movespeed';
Stats._OV = 'omnivamp';
Stats._tenacity = 'tenacity';
