import { Champ as dbChamp, ChampStat } from "../db/models/Champ";
import { Stats } from "../interfaces";
import { champCache } from "../db/config";

export class Champ extends Stats {
	id: number
	name: string
	from: number[]
	into: number[]
	dbObj: dbChamp
	constructor(
		name: string,
		id: number,
		stats: ChampStat[],
		dbItem: dbChamp
	) {
		super(stats)
		this.name = name
		this.id = id
		this.dbObj = dbItem
	}
	public static async find(id: string): Promise<Champ | null>
	public static async find(id: number): Promise<Champ | null>
	public static async find(id: string | number): Promise<Champ | null> {
        if (typeof id === 'number') {
            const cachedChamp: Champ | null | undefined = champCache.get(id)
            if (cachedChamp) {
                return cachedChamp
            }
        }
		const champ =
			typeof id === 'string'
				? await dbChamp.findOne({ where: { name: id } })
				: await dbChamp.findByPk(id)
		if (!champ) {
			return null
		} else {
			const dbStats = await ChampStat.findAll({ where: { champId: champ.champId } })
            const newChamp = new this(champ.champName, champ.champId, dbStats, champ)
			champCache.set(newChamp.id, newChamp)
            return newChamp
		}
	}
}