import express from 'express'
import findBuilds from '../dal/builds'
import { respond } from '../responder'
import { Item } from '../dal/items'

const buildRouter = express.Router()

buildRouter.get('/', async (req, res) => {
    const builds = await findBuilds(req.user.id, { raw: true })
    respond(res, {data: builds, status: builds.length === 0 ? 404 : 200})
})

buildRouter.post('/', async (req, res) => {
    const newItem = await Item.find('Faerie Charm')
    if (newItem) {
        console.log(newItem)
    }
    res.status(200).end()
})

export default buildRouter