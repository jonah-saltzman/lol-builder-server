import express from 'express'
import { Item, itemFilter } from '../dal/items'
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

itemRouter.post('/', async (req, res) => {
    try {
        const requested = req.body.items as number[]
        const items = (await Promise.all(requested.map(id => Item.find(id)))).filter(itemFilter)
        const response = items.map(item => ({
            info: {
                itemId: item.id,
                itemName: item.name,
                icon: item.icon
            },
            stats: item.statsArray()
        }))
        res.json(response).status(response.length === 0 ? 404 : 200)
    } catch(e) {
        console.error(e)
        res.status(500).send()
    }
})

export default itemRouter