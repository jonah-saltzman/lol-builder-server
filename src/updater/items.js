const { Item, ItemInto } = require('../db/models/Item')
const { Stat, ItemStat } = require('../db/models/Stat')

const REMOVED = [4403, 7020, 7023]

const updateItems = async (parsedItems) => {
    try {
        await ItemInto.destroy({ where: {}, truncate: false, cascade: false })
        await ItemStat.destroy({ where: {}, truncate: false, cascade: false })
        await Item.destroy({where: {}, truncate: false, cascade: true})
        const builtItems = []
        const builtItemStats = []
        const builtItemIntos = []

        const stats = await Stat.findAll()
        for (const item of Object.values(parsedItems)) {
            const buildFrom = item.buildsFrom ? item.buildsFrom : item.builds_from
            const buildInto = item.buildsInto ? item.buildsInto : item.builds_into
            if (buildFrom.length === 0 && buildInto.length === 0) {
                continue
            }
            const isMythic = item.passives.some((p) => p.mythic === true)
            const isLegendary =
                !isMythic &&
                buildInto.length === 0 &&
                !buildFrom.some((from) => from === 1001)
            const dbItem = Item.build({
                itemId: item.id,
                name: item.name,
                colloq: item.nicknames.join(';'),
                plaintext: item.simpleDescription,
                baseGold: 0,
                totalGold: item.shop.prices.total,
                legendary: isLegendary,
                mythic: isMythic,
            })
            builtItems.push(dbItem)
            for (const into of buildInto) {
                if (REMOVED.some((num) => num === into) || isLegendary || isMythic) {
                    continue
                }
                const obj = { fromItem: dbItem.itemId, intoItem: into }
                builtItemIntos.push(ItemInto.build(obj))
            }
            for (const [type, mod] of Object.entries(item.stats)) {
                const stat = stats.find((stat) => {
                    if (stat.statName === type) {
                        return true
                    }
                    const aliases = stat.alias ? stat.alias.split(';') : []
                    if (aliases.some((alias) => alias === type)) {
                        return true
                    }
                    return false
                })
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
                })
                builtItemStats.push(itemStat)
            }
            for (const p of item.passives) {
                const unique = p.unique
                for (const [type, mod] of Object.entries(item.stats)) {
                    const stat = stats.find((stat) => {
                        if (stat.statName === type) {
                            return true
                        }
                        const aliases = stat.alias ? stat.alias.split(';') : []
                        if (aliases.some((alias) => alias === type)) {
                            return true
                        }
                        return false
                    })
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
                    })
                    builtItemStats.push(itemStat)
                }
            }
        }
        await Promise.all(builtItems.map((item) => item.save()))
        await Promise.all(builtItemIntos.map((item) => item.save()))
        const numeric = [
            'flat',
            'percent',
            'perLevel',
            'percentPerLevel',
            'percentBase',
            'percentBonus',
        ]
        const doneItemStats = []
        for (const stat of builtItemStats) {
            const existing = doneItemStats.find((done) => {
                if (done.statId === stat.statId && done.itemId === stat.itemId) {
                    return true
                }
                return false
            })
            if (existing) {
                for (const name of numeric) {
                    existing.setDataValue(
                        name,
                        Math.max(existing.getDataValue(name), stat[name])
                    )
                }
                await existing.save()
            } else {
                await stat.save()
                doneItemStats.push(stat)
            }
        }
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

module.exports = updateItems
