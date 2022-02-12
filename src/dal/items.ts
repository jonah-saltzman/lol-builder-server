import { Item as dbItem, ItemInto } from "../db/models/Item";
import { ItemStat } from "../db/models/Stat";
import { Stats } from '../interfaces'

export class Item extends Stats {
	id: number
	name: string
    from: number[]
    into: number[]
    dbObj: dbItem
	constructor(name: string, id: number, stats: ItemStat[], from: number[], into: number[], dbItem: dbItem) {
		super(stats)
		this.name = name
		this.id = id
        this.from = from
        this.into = into
        this.dbObj = dbItem
	}
	public static async find(id: string): Promise<Item | null>
	public static async find(id: number): Promise<Item | null>
	public static async find(id: string | number): Promise<Item | null> {
        const item =
					typeof id === 'string'
						? await dbItem.findOne({ where: { name: id } })
						: await dbItem.findByPk(id)
        if (!item) {
            return null
        } else {
            const dbStats = await ItemStat.findAll({where: {itemId: item.itemId}})
            const into = (await ItemInto.findAll({where: {fromItem: item.itemId}})).map(into => into.intoItem)
            const from = (await ItemInto.findAll({where: {intoItem: item.itemId}})).map(into => into.fromItem)
            return new this(item.name, item.itemId, dbStats, from, into, item)
        }
	}
}

export const itemFilter = (item: Item | null): item is Item => {
    return !!item
}