import express from 'express'
import { findUserByEmail, newLocalUser } from '../dal/users'
import { respond } from '../responder'
import { Token } from '../tokens'

const authRouter = express.Router()

authRouter.get('/signout', async (req, res) => {
    if (await req.token.invalidate()) {
        return respond(res, {message: `${req.user.email} signed out.`, status: 200})
    }
    respond(res, null)
})

authRouter.patch('/changepass', async (req, res) => {
    console.log('hit changepass')
    try {
        console.log('hit changepass')
        console.log(req.body)
        if (!req.body.oldPass || !req.body.newPass) throw 400
        if (req.user.changePassword(req.body.oldPass, req.body.newPass)) {
            return respond(res, {message: 'Password changed successfully', status: 200})
        } else {
            throw 401
        }
    } catch (e) {
        if (typeof e === 'number') return respond(res, {status: e})
        respond(res, null)
    }
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
    user = await newLocalUser(req.email, req.password)
    if (user) {
        return respond(res, {
					message: 'Account created',
					data: { email: user.email },
					status: 201,
				})
    }
    return respond(res, null)
})

authRouter.post('/signin', async (req, res) => {
    const user = await findUserByEmail(req.email)
    if (!user) {
        return respond(res, {message: 'User not found', status: 404})
    } else {
        if (!user.checkPassword(req.password)) {
            return respond(res, {message: 'Invalid password', status: 401})
        }
        const token = new Token(user, 'web', 'local')
        await token.register()
        return respond(res, {
					message: `${user.email} signed in.`,
					data: { token: token.string },
					status: 200,
				})
    }
})

export default authRouter