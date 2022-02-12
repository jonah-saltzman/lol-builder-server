import express from 'express'
import findBuilds from '../dal/builds'
import { respond } from '../responder'
import { Item, itemFilter } from '../dal/items'
import { Champ } from '../dal/champ'
import { Build } from '../dal/builds'

const buildRouter = express.Router()

buildRouter.get('/', async (req, res) => {
    const builds = (await findBuilds(req.user, { raw: true })).filter((build): build is Build => !!build)
    respond(res, {data: builds, status: builds.length === 0 ? 404 : 200})
})

buildRouter.post('/new', async (req, res) => {
    console.log(req.body)
    const champId: number = req.body.champId
    const buildName: string = req.body.buildName ?? null
    const itemIds: number[] = req.body.items ?? []
    if (!champId) {
        respond(res, {status: 400, message: 'Must specify champion'})
        return
    } else {
        const champ = await Champ.find(champId)
        if (!champ) {
            respond(res, {status: 404, message: 'Champ not found'})
        } else {
            try {
                const items = (await Promise.all(itemIds.map(id => Item.find(id)))).filter(itemFilter)
                const newBuild = await Build.create({items, champ, user: req.user, name: buildName})
                if (newBuild) {
                    //console.log(newBuild)
                    respond(res, {data: [newBuild], status: 200})
                    return
                } else {
                    respond(res, null)
                    return
                }
            } catch(e) {
                console.error(e)
                respond(res, null)
            }
        }
    }
})

export default buildRouter