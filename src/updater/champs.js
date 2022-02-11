const { Champ, ChampStat } = require('../db/models/Champ')
const { Stat } = require('../db/models/Stat')



const updateChamps = async (parsed) => {
    try {
        await ChampStat.destroy({ where: {}, truncate: false, cascade: false })
        await Champ.destroy({ where: {}, truncate: false, cascade: true })
        const builtChamps = []
        const builtChampStats = []
        const stats = await Stat.findAll()
        for (const champ of Object.values(parsed)) {
            const dbItem = Champ.build({
                champId: champ.id,
                champName: champ.name,
                title: champ.title,
                icon: champ.icon,
                resourceType: champ.resource
            })
            builtChamps.push(dbItem)
            for (const [type, mod] of Object.entries(champ.stats)) {
                console.log('adding stat: ', type)
                console.log('to champ: ', dbItem.champName)
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
                if (stat === undefined) {
                    continue
                }
                const champStat = ChampStat.build({
                    statId: stat.statId,
                    champId: champ.id,
                    flat: mod.flat,
                    percent: mod.percent,
                    perLevel: mod.perLevel,
                    percentPerLevel: mod.percentPerLevel
                })
                builtChampStats.push(champStat)
            }
        }
        await Promise.all(builtChamps.map(champ => champ.save()))
        await Promise.all(builtChampStats.map(stat => stat.save()))
        console.log('AFTER PROMISES')
        return true
    } catch(e) {
        console.error(e)
        return false
    }
}

module.exports = updateChamps