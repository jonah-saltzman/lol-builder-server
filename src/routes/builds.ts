import express from 'express'
import findBuilds from '../dal/builds'
import { respond } from '../responder'
import { Item, itemFilter } from '../dal/items'
import { Champ } from '../dal/champ'
import { Build } from '../dal/builds'

const buildRouter = express.Router()

buildRouter.get('/', async (req, res) => {
    const builds = await findBuilds(req.user.id, { raw: true })
    respond(res, {data: builds, status: builds.length === 0 ? 404 : 200})
})

buildRouter.post('/new', async (req, res) => {
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
                const newBuild = await Build.create({items, champ, user: req.user.id, name: buildName})
                if (newBuild) {
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

buildRouter.patch('/:buildId', async (req, res) => {
    try {
        if (!req.params.buildId || req.params.buildId.length === 0) throw 400
        const champId: number = req.body.champId
        const itemIds: number[] = req.body.items
        if (!champId || !itemIds) throw 400
        const buildName: string = req.body.buildName ?? null
        const build = await Build.fromId(parseInt(req.params.buildId))
        const champ = await Champ.find(champId)
        const items = (await Promise.all(itemIds.map(id => Item.find(id)))).filter(itemFilter)
        console.log(`build ${req.params.buildId} belongs to user ${build?.user}`)
        console.log(`the authenticated user is ${req.user.id}`)
        if (!build || !champ || items.length !== itemIds.length) throw 500
        if (build.user !== req.user.id) throw 401
        build.name = buildName
        build.champ = champ
        build.items = items
        if (await build.update()) {
            respond(res, {status: 200, data: [build]})
        } else {
            throw 500
        }
    } catch (status) {
        if (typeof status === 'number') {
            respond(res, { status })
        } else {
            respond(res, null)
        }
    }
})

buildRouter.delete('/:buildId', async (req, res) => {
    try {
        if (!req.params.buildId || req.params.buildId.length === 0) throw 400
        const build = await Build.fromId(parseInt(req.params.buildId))
        if (!build) throw 404
        if (build.user !== req.user.id) throw 401
        if (await build.destroy()) {
            respond(res, {status: 200})
        } else {
            throw 500
        }
    } catch(status) {
        if (typeof status === 'number') {
            respond(res, {status})
        } else {
            respond(res, null)
        }
    }
})

export default buildRouter