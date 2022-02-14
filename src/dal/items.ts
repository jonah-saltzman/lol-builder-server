import { Item as dbItem, ItemInto } from "../db/models/Item";
import { ItemStat } from "../db/models/Stat";
import { Stats } from '../interfaces'
import { ItemInBuild } from "../db/models/Build";
import { itemCache } from "../db/config";
import { Mods } from "../interfaces";

export class Item extends Stats {
	id: number
	name: string
	from: number[]
	into: number[]
	dbObj: dbItem
    stats: ItemStat[]
    icon: string
	constructor(
		name: string,
		id: number,
		stats: ItemStat[],
		from: number[],
		into: number[],
		dbItem: dbItem,
        icon: string
	) {
		super(stats)
		this.name = name
		this.id = id
		this.from = from
		this.into = into
		this.dbObj = dbItem
        this.stats = stats
        this.icon = icon
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
			const dbStats = await ItemStat.findAll({ where: { itemId: item.itemId } })
			const into = (
				await ItemInto.findAll({ where: { fromItem: item.itemId } })
			).map((into) => into.intoItem)
			const from = (
				await ItemInto.findAll({ where: { intoItem: item.itemId } })
			).map((into) => into.fromItem)
			return new this(item.itemName, item.itemId, dbStats, from, into, item, item.icon)
		}
	}
	statsArray() {
		// const entries = { ...this }
		// return Object.entries(entries)
		// 	.map(([name, mods]) => ({
		// 		statName: name,
		// 		mods: mods as Mods,
		// 	}))
		// 	.filter((obj) => !(obj.statName in ['id', 'name', 'from', 'into', 'dbObj']))
        return this.stats
	}
}

export const getItemsInBuild = async(buildId: number) => {
    const itemInBuilds = await ItemInBuild.findAll({where: {buildId}})
    itemInBuilds.sort((itemA, itemB) => itemA.position - itemB.position)
    const initial: Item[] = []
    const cachedArray = itemInBuilds.reduce((arr: Item[], dbObj) =>{
        const item: Item | null | undefined = itemCache.get(dbObj.itemId)
        if (item) {
            arr.push(item)
        }
        return arr
    }, initial)
    if (cachedArray.length === itemInBuilds.length) {
        console.log('returning cached items')
        return cachedArray
    }
    const items = (await Promise.all(itemInBuilds.map(id => Item.find(id.itemId)))).filter(itemFilter)
    const set = itemCache.mset(
			items.map((item) => ({ key: item.id, val: item }))
		)
    if (set) {
        console.log(`added ${items.length} items to the cache`)
    } else {
        console.log('error adding items to cache')
    }
    return items
}

export const addItemsToBuild = async (buildId: number, items: Item[]): Promise<ItemInBuild[]> => {
    const objArray = items.map((item, i) => ({ buildId, itemId: item.id, position: i, isPath: false }))
    const itemsInBuild = await ItemInBuild.bulkCreate(objArray)
    console.log(`added ${itemsInBuild.length} items to build ${buildId}:`)
    console.log(itemsInBuild)
    return itemsInBuild
}

export const replaceItemsInBuild = async (buildId: number, items: Item[]): Promise<ItemInBuild[] | null> => {
    try {
        const deleted = await ItemInBuild.destroy({where: {buildId}})
        console.log(`deleted ${deleted} iteminbuilds`)
        if (items.length > 0) {
            const newItems = await addItemsToBuild(buildId, items)
            if (newItems && newItems.length === items.length) {
                return newItems
            } else {
                return null
            }
        } else {
            return []
        }
    } catch(e) {
        console.log('caught error in replaceItems')
        console.error(e)
        return null
    }
}

export const itemFilter = (item: Item | null): item is Item => {
    return !!item
}