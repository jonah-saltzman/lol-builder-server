import express from 'express'
import { Item } from '../dal/items'
import { respond } from '../responder'
import { itemCache } from '../db/config'

const itemRouter = express.Router()

itemRouter.get('/:itemId', async (req, res) => {
    const cacheitem = itemCache.get<Item>(req.params.itemId)
    if (cacheitem) {
        respond(res, { data: [cacheitem], status: 200 })
        return
    }
    const item = await Item.find(parseInt(req.params.itemId))
    if (item) {
        respond(res, {data: [item], status: 200})
        itemCache.set(item.id, item)
    } else {
        respond(res, {status: 404})
    }
})

export default itemRouter