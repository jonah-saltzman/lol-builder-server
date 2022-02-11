import { Build as dbBuild } from "../db/models/Build"
import { Item } from "../db/models/Item"
import { User } from "../db/models/User"

interface SearchOptions {
    raw: boolean
}

const getBuildsByUser = async (userId: number, opts?: SearchOptions) => {
	return await dbBuild.findAll({ where: { userId }, raw: opts?.raw || false })
}

class Build {
    user: User
    buildId: number
    item1?: Item
}

export default getBuildsByUser