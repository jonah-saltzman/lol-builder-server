import express from 'express'
import findBuilds from '../dal/builds'
import { respond } from '../responder'

const buildRouter = express.Router()

buildRouter.get('/', async (req, res) => {
    const builds = await findBuilds(req.user.id, {raw: false })
    console.log(builds)
    respond(res, {data: builds, status: builds.length === 0 ? 404 : 200})
})

buildRouter.post('/', async (req, res) => {
    
})

export default buildRouter