import { Build } from "./dal/builds"
import { ItemStat } from "./db/models/Stat"
import { openCache } from "./db/config"
import { Stat } from "./db/models/Stat"
import { Item } from "./dal/items"
import { ChampStat } from "./db/models/Champ"

export type ItemObject = {
    itemId: number,
    from: number[],
    into: number[],
    stats: ItemStat[]
}

export interface BuildObject {
    buildName?: string
    buildId: number
    champId: number
    champStats: ChampStat[]
    items: ItemObject[]
}

export interface SignupResponse {
	email: string
}

export interface TokenResponse {
    token: string
}

export interface ApiResponse {
	status: number
	message?: string
	data?: SignupResponse | TokenResponse | Item[] | BuildObject[]
	redirect?: string
}

export type AuthType = 'local'

export type AuthSource = 'native' | 'web'

export enum Modifiers {
	FLAT = 'flat',
	PERCENT = 'percent',
	perLevel = 'perLevel',
	PPL = 'percentPerLevel',
}

export type Mods = {[key in Modifiers]: number}


enum statName {
    AP = 'abilityPower',
    armor = 'armor',
    AD = 'attackDamage',
    AS = 'attackSpeed',
    AH = 'abilityHaste',
    critChance = 'criticalStrikeChance',
    HSP = 'healAndShieldPower',
    health = 'health',
    HR = 'healthRegen',
    lethality = 'lethality',
    LS = 'lifesteal',
    MP = 'magicPenetration',
    MR = 'magicResistance',
    mana = 'mana',
    manaRegen = 'manaRegen',
    MS = 'movespeed',
    OV = 'omnivamp',
    tenacity = 'tenacity',
    armorPen = 'armorPenetration'
}

export class Stats {
    public static _AP = 'abilityPower'
    public static _armor = 'armor'
    public static _armorPen = 'armorPenetration'
    public static _AD = 'attackDamage'
    public static _AS = 'attackSpeed'
    public static _AH = 'abilityHaste'
    public static _critChance = 'criticalStrikeChance'
    public static _HSP = 'healAndShieldPower'
    public static _health = 'health'
    public static _HR = 'healthRegen'
    public static _lethality = 'lethality'
    public static _LS = 'lifesteal'
    public static _MP = 'magicPenetration'
    public static _MR = 'magicResistance'
    public static _mana = 'mana'
    public static _manaRegen = 'manaRegen'
    public static _MS = 'movespeed'
    public static _OV = 'omnivamp'
    public static _tenacity = 'tenacity'
    AP: Mods
    armor: Mods
    AD: Mods
    AS: Mods
    AH: Mods
    critChance: Mods
    HSP: Mods
    health: Mods
    HR: Mods
    lethality: Mods
    LS: Mods
    MP: Mods
    MR: Mods
    mana: Mods
    manaRegen: Mods
    MS: Mods
    OV: Mods
    tenacity: Mods
    armorPen: Mods
    constructor(stats: ItemStat[] | ChampStat[]) {
        const isChamp = typeof stats[0] === typeof ChampStat
        const allStats: Array<Stat> | undefined = openCache.get('stats')
        if (!allStats) {
            throw new Error('couldnt get stats')
        }
        for (const stat of stats) {
            const name = allStats.find(prop => prop.statId === stat.statId)?.statName
            const mods: Mods = {
                flat: stat.flat,
                percent: stat.percent,
                perLevel: stat.perLevel,
                percentPerLevel: stat.percentPerLevel
            }
            switch (name) {
                case 'abilityPower':
                    this.AP = mods
                    break
                case 'armor':
                    this.armor = mods
                    break
                case 'armorPenetration':
                    this.armorPen = mods
                    break
                case 'attackDamage':
                    this.AD = mods
                    break
                case 'attackSpeed':
                    this.AS = mods
                    break
                case 'abilityHaste':
                    this.AH = mods
                    break
                case 'criticalStrikeChance':
                    this.critChance = mods
                    break
                case 'healAndShieldPower':
                    this.HSP = mods
                    break
                case 'health':
                    this.health = mods
                    break
                case 'healthRegen':
                    this.HR = mods
                    break
                case 'lethality':
                    this.lethality = mods
                    break
                case 'lifesteal':
                    this.LS = mods
                    break
                case 'magicPenetration':
                    this.MP = mods
                    break
                case 'magicResistance':
                    this.MR = mods
                    break
                case 'mana':
                    this.mana = mods
                    break
                case 'manaRegen':
                    this.manaRegen = mods
                    break
                case 'movespeed':
                    this.MS = mods
                    break
                case 'omnivamp':
                    this.OV = mods
                    break
                case 'tenacity':
                    this.tenacity = mods
                    break
                default:
                    console.log('FAILED TO ADD STAT: ', name)
                    break
            }
        }
    }
}