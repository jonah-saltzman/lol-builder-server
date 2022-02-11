import express from 'express'
import { Item } from '../dal/items'
import { respond } from '../responder'

const itemRouter = express.Router()

itemRouter.get('/:itemId', async (req, res) => {
    console.log(req.params.itemId)
    const item = await Item.find(parseInt(req.params.itemId))
    if (item) {
        respond(res, {data: [item], status: 200})
    } else {
        respond(res, null)
    }
})

export default itemRouter