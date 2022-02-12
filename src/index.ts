import { config } from 'dotenv'
config()
import http from 'http'
import express, { Application, Request as Req, Response as Res } from 'express'
import { Server } from 'socket.io'
import mySQL, { openCache } from './db/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import './custom.ts'

import authRoutes from './routes/auth'
import { requireToken } from './tokens'
import Updater from './updater'
import { Item } from './db/models/Item'
import { Champ } from './db/models/Champ'
import buildRouter from './routes/builds'
import { Stat } from './db/models/Stat'
import itemRouter from './routes/items'
//import { SocketInit } from './socket.io'
const PORT = parseInt(process.env.PORT || '6000') as number

const app: Application = express()
const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

interface AllItems {
	[id: number]: string
}

app.get('/items', (req, res) => {
	if (openCache.has('allItems')) {
		console.log('items in cache')
		res.json(openCache.get('allItems'))
	} else {
		Item.findAll({ raw: true }).then((items) => {
			console.log('items not in cache')
			res.json(items)
		})
	}
})

app.get('/champs', (req, res) => {
	if (openCache.has('allChamps')) {
		console.log('champs in cache')
		res.json(openCache.get('allChamps'))
	} else {
		Champ.findAll({ raw: true }).then((champs) => {
			console.log('champs not in cache')
			res.json(champs)
		})
	}
})

app.use('/auth', authRoutes)
app.use(requireToken)
app.get('/signout', authRoutes)
app.use('/', buildRouter)
app.use('/item', itemRouter)

mySQL
	.sync()
	.then((seq) => {
		console.log('successfully synced mySQL db')
		Updater()
			.then((res) => {
				console.log(res)
				Item.findAll({ raw: true }).then((items) => {
					openCache.set('allItems', items)
				})
				Champ.findAll({ raw: true }).then((champs) => {
					openCache.set('allChamps', champs)
				})
				Stat.findAll({ raw: true }).then((stats) => {
					openCache.set('stats', stats)
				})
			})
			.catch(console.log)
	})
	.then(() => {
		server.listen(PORT, () => {
			console.log('Listening on port ', PORT)
		})
	})
