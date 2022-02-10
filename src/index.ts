import { config } from 'dotenv'
config()
import http from 'http'
import express, { Application, Request as Req, Response as Res } from 'express'
import { Server } from 'socket.io'
import mySQL from './db/config'
import cors from 'cors'
import bodyParser from 'body-parser'
import './custom.ts'

import authRoutes from './routes/auth'
import { requireToken } from './tokens'
import { needToUpdate } from './updater'
//import { SocketInit } from './socket.io'
const PORT = parseInt(process.env.PORT || '6000') as number

const app: Application = express()
const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

// mySQL.sync().then(seq => {
//     console.log('successfully synced mySQL db')
    
// })

mySQL.authenticate().then(() => {
    console.log('calling needtoupdate')
    needToUpdate()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use(requireToken)
app.get('/signout', authRoutes)

server.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})