import { config } from 'dotenv'
config()
import http from 'http'
import express, { Application, Request as Req, Response as Res } from 'express'
import { Server } from 'socket.io'
import mySQL from './db/config'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import bodyParser from 'body-parser'
//import { SocketInit } from './socket.io'
const PORT = parseInt(process.env.PORT || '6000') as number

const app: Application = express()
const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })

mySQL.sync()

app.use(bodyParser)
app.use(cors())

server.listen(PORT, () => {
    console.log('Listening on port ', PORT)
})