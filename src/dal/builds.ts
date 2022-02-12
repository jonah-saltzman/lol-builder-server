import { Build as dbBuild } from "../db/models/Build"
import { Item } from "./items"
import { User } from "../db/models/User"
import { Champ } from "./champ"

interface SearchOptions {
    raw: boolean
}

const getBuildsByUser = async (user: User, opts?: SearchOptions) => {
	const builds = await dbBuild.findAll({ where: { userId: user.id }, raw: opts?.raw || false })
    return await Promise.all(builds.map(build => Build.fromId(build.buildId, user)))
}

interface Builder {
    user: User,
    champ: Champ,
    items?: Item[]
    name?: string
}

interface NewBuild extends Builder {
    dbObj: dbBuild
}

export class Build {
	user: User
	buildId: number
    champ: Champ
	items?: Item[]
    dbObj: dbBuild
    name?: string
    id: number
    constructor(build: NewBuild) {
        this.user = build.user
        this.champ = build.champ
        this.items = build?.items ?? []
        this.id = build.dbObj.buildId
        this.dbObj = build.dbObj
        this.name = build.name
    }
    public static async fromId (buildId: number, user: User): Promise<Build | null> {
        const build = await dbBuild.findByPk(buildId)
        if (build) {
            const items: Item[] = []
            build.allItems().forEach(async id => {
                const item = await Item.find(id)
                if (item) items.push(item)
            })
            const champ = await Champ.find(build.champion)
            if (!champ) return null
            console.log('found build from ID: ', build.name)
            return new this({user, champ, items, dbObj: build, name: build.name})
        } else {
            return null
        }
    }
    public static async create(build: Builder): Promise<Build> {
        const newBuild = {
					userId: build.user.id,
					champion: build.champ.id,
					Item1: (build.items ? build.items[0]?.id : null) ?? null,
					Item2: (build.items ? build.items[1]?.id : null) ?? null,
					Item3: (build.items ? build.items[2]?.id : null) ?? null,
					Item4: (build.items ? build.items[3]?.id : null) ?? null,
					Item5: (build.items ? build.items[4]?.id : null) ?? null,
					Item6: (build.items ? build.items[5]?.id : null) ?? null,
                    name: build.name
				}
        console.log('saving into DB:')
        console.log(newBuild)
        const dbObj = await dbBuild.create(newBuild)
        console.log('saved DB object:')
        console.log(dbObj)
        const params: NewBuild = {
            user: build.user,
            champ: build.champ,
            dbObj,
            items: build.items,
            name: build.name
        }
        return new this(params)
    }
}

export default getBuildsByUser