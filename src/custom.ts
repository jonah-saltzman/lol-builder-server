import { User } from './db/models/User'
import express from 'express'
import { UserToken } from './db/models/UserToken'

declare global {
	namespace Express {
		interface Request {
			email: string
			password: string
			user: User
            tokenId: string
            token: UserToken
		}
	}
}