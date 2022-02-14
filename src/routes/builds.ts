import express from 'express'
import findBuilds from '../dal/builds'
import { respond } from '../responder'
import { Item, itemFilter } from '../dal/items'
import { Champ } from '../dal/champ'
import { Build } from '../dal/builds'

const buildRouter = express.Router()

buildRouter.get('/', async (req, res) => {
    const builds = await findBuilds(req.user.id, { raw: true })
    console.log(builds)
    const response = builds.map(build => build.toObject())
    if (response.length === 0) {
        return respond(res, {status: 404})
    } else {
        return respond(res, {data: response, status: 200})
    }
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
                    respond(res, {data: [newBuild.toObject()], status: 200})
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

// req.body.buildId
// req.body.champId
// req.body.items
// req.body.buildName

buildRouter.patch('/', async (req, res) => {
    try {
        if (!req.body.buildId || req.body.buildId.length === 0) throw 400
        const champId: number = req.body.champId
        const itemIds: number[] = req.body.items
        if (!champId || !itemIds) throw 400
        const buildName: string = req.body.buildName ?? null
        const build = await Build.fromId(parseInt(req.body.buildId))
        const champ = await Champ.find(champId)
        const items = (await Promise.all(itemIds.map(id => Item.find(id)))).filter(itemFilter)
        console.log(`build ${req.body.buildId} belongs to user ${build?.user}`)
        console.log(`the authenticated user is ${req.user.id}`)
        if (!build || !champ || items.length !== itemIds.length) throw 500
        if (build.user !== req.user.id) throw 401
        build.name = buildName
        build.champ = champ
        build.items = items
        if (await build.update()) {
            respond(res, {status: 200, data: [build.toObject()]})
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

buildRouter.delete('/', async (req, res) => {
    try {
        if (!req.body.buildId || req.body.length === 0) throw 400
        const build = await Build.fromId(parseInt(req.body.buildId))
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