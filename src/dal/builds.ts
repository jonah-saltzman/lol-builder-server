import { Build as dbBuild, ItemInBuild } from "../db/models/Build"
import { Item, getItemsInBuild, addItemsToBuild, replaceItemsInBuild } from "./items"
import { Champ } from "./champ"

interface SearchOptions {
    raw: boolean
}

const getBuildsByUser = async (user: number, opts?: SearchOptions) => {
	const builds = await dbBuild.findAll({ where: { userId: user }, raw: opts?.raw || false })
    return (await Promise.all(builds.map(build => Build.fromId(build.buildId)))).filter((build): build is Build => !!build)
}

interface Builder {
    user: number,
    champ: Champ,
    items?: Item[]
    name?: string
}

interface NewBuild extends Builder {
    dbObj: dbBuild
}

export class Build {
	user: number
	buildId: number
    champ: Champ
	items: Item[]
    dbObj: dbBuild
    name?: string
    constructor(build: NewBuild) {
        this.user = build.user
        this.champ = build.champ
        this.items = build?.items ?? []
        this.buildId = build.dbObj.buildId
        this.dbObj = build.dbObj
        this.name = build.name
    }
    public static async fromId(buildId: number): Promise<Build | null> {
        const build = await dbBuild.findByPk(buildId)
        if (build) {
            const items: Item[] = await getItemsInBuild(buildId)
            const champ = await Champ.find(build.champId)
            const user = build.userId
            if (!champ || !user) return null
            return new this({user, champ, items, dbObj: build, name: build.buildName})
        } else {
            return null
        }
    }
    public static async create(build: Builder): Promise<Build | null> {
        const newBuild = {
					userId: build.user,
					champId: build.champ.id,
                    buildName: build.name,
				}
        const dbObj = await dbBuild.create(newBuild)
        const itemsInBuild = build.items ? await addItemsToBuild(dbObj.buildId, build.items) : undefined
        if (itemsInBuild) {
            const itemsArray = await getItemsInBuild(dbObj.buildId)
            if (itemsArray.length !== itemsInBuild.length) {
                return null
            } else {
                return new this({user: build.user, champ: build.champ, dbObj, items: itemsArray})
            }
        } else {
            const params: NewBuild = {
                user: build.user,
                champ: build.champ,
                dbObj,
                name: build.name,
            }
            return new this(params)
        }
    }

    async update(): Promise<boolean> {
        try {
            let needToUpdate = false
            if (this.name !== this.dbObj.buildName && this.name) {
                this.dbObj.buildName = this.name
                needToUpdate = true
            }
            if (this.champ.id !== this.dbObj.champId) {
                this.dbObj.champId = this.champ.id
                needToUpdate = true
            }
            const dbItemsInBuild = await getItemsInBuild(this.buildId)
            const items: Item[] = this.items ? this.items : []
            if (dbItemsInBuild.some((itemInB, i) => itemInB.id !== items[i]?.id) || items.length !== dbItemsInBuild.length) {
                const newItems = await replaceItemsInBuild(this.buildId, items)
                if (newItems && newItems.length !== items.length) {
                    throw new Error('number of items in DB doesnt match object')
                }
            }
            if (needToUpdate) {
                await this.dbObj.save()
                return true
            } else {
                return true
            }
        } catch(e) {
            console.error(e)
            return false
        }
    }
    async destroy(): Promise<boolean> {
        try {
            await ItemInBuild.destroy({where: {buildId: this.buildId}})
            await this.dbObj.destroy()
            return true
        } catch(e) {
            console.error(e)
            return false
        }
    }
}

export default getBuildsByUser