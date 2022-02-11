import { Build } from "../db/models/Build"

interface SearchOptions {
    raw: boolean
}

const getBuildsByUser = async (userId: number, opts?: SearchOptions) => {
	return await Build.findAll({ where: { userId }, raw: opts?.raw || false })
}

export default getBuildsByUser