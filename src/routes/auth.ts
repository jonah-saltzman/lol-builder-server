import express from 'express'
import { findUserByEmail, newUser } from '../db/models/User'
import { Op } from 'sequelize'
import { respond } from '../responder'
import { Token } from '../tokens'
import { findTokenByUuid } from '../db/models/UserToken'

const authRouter = express.Router()

authRouter.get('/signout', async (req, res) => {
    console.log('in signout:')
    console.log(req.token)
    if (await req.token.invalidate()) {
        return respond(res, {message: `${req.user.email} signed out.`, status: 200})
    }
    respond(res, null)
})

authRouter.use((req, res, next) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return respond(res, {message: 'Missing parameters', status: 401})
    }
    req.email = req.body.email
    req.password = req.body.password
    next()
})

authRouter.post('/signup', async (req, res) => {
    let user = await findUserByEmail(req.email)
    if (user) {
        return respond(res, { message: 'Account exists', status: 409 })
    }
    user = await newUser(req.email, req.password)
    if (user) {
        return respond(res, {
					message: 'Account created',
					data: { email: user.email },
					status: 201,
				})
    }
    return respond(res, { status: 500 })
})

authRouter.post('/signin', async (req, res) => {
    const user = await findUserByEmail(req.email)
    if (!user) {
        return respond(res, {message: 'User not found', status: 400})
    } else {
        if (!user.checkPassword(req.password)) {
            return respond(res, {message: 'Invalid password', status: 401})
        }
        const token = new Token(user, 'web', 'local')
        await token.register()
        return respond(res, {message: `${user.email} signed in.`, data: {token: token.string}, status: 200})
    }
})

export default authRouter