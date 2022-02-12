import sequelize from "../db/config";
import { openCache } from "../db/config";

const buildChampQuery = (buildId: number) => {
    const id = buildId.toString()
    return `SELECT Champs.champId, ChampStats.*, FROM Builds
        INNER JOIN Champs
        on Champs.champId = Builds.champId
        INNER JOIN ChampStats
        on ChampStats.champId = Builds.champId
        AND Builds.userId = ${id};`

        // INNER JOIN ItemStats
        // on ItemStats.itemId = Items.itemId
}

const buildItemQuery = (buildId: number) => {
	const id = buildId.toString()
	return `SELECT Builds.buildId, Items.itemId, Champs.champId, ChampStats.*, FROM Builds
        INNER JOIN ItemInBuilds as ItemJoins
        on ItemJoins.buildId = Builds.buildId
        INNER JOIN Items
        on Items.itemId = ItemJoins.itemId
        INNER JOIN Champs
        on Champs.champId = Builds.champId
        INNER JOIN ChampStats
        on ChampStats.champId = Builds.champId
        AND Builds.userId = ${id};`

	// INNER JOIN ItemStats
	// on ItemStats.itemId = Items.itemId
}

const getBuildById = async (buildId: number) => {
    const [results, metadata] = await sequelize.query(buildChampQuery(buildId))
    const uniqueItems = []
    for (const result of results) {

    }
}

getBuildById(1)