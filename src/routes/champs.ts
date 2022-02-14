import express from 'express'
import { respond } from '../responder'
import { Champ } from '../dal/champ'

const champRouter = express.Router()

champRouter.get('/:champId', async (req, res) => {
	try {
        const champ = await Champ.find(parseInt(req.params.champId))
        if (champ) {
            res.json({stats: champ.statsArray()}).status(200)
        } else {
            respond(res, { status: 404 })
        }
    } catch(e) {
        console.error(e)
        respond(res, null)
    }
})

export default champRouter
