import { config } from 'dotenv'
config()
import http from 'http'
import express, { Application, Request as Req, Response as Res } from 'express'
import { Server } from 'socket.io'
import { Sequelize } from 'sequelize-typescript'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
//import { SocketInit } from './socket.io'

const app: Application = express()
const server = http.createServer(app)
export const io = new Server(server, { cors: { origin: '*' } })
