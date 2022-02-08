import express from 'express'
import { User } from '../db/models/User'
import { Op } from 'sequelize'
import { respond } from '../responder'
import { Token } from '../tokens'

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const user = await User.findOne({
			where: { [Op.and]: [{ email: req.body.email }, { deletionDate: null }] },
		})
    if (user) {
        return respond(res, { message: 'Account exists', status: 409 })
    }
    const newUser = User.build({email: req.body.email})
    if (newUser.newPassword(req.body.password)) {
        await newUser.save()
        return respond(res, {
					message: 'Account created',
					data: { email: newUser.email },
					status: 201,
				})
    }
    return respond(res, { status: 500 })
})

authRouter.post('/signin', async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        return respond(res, {message: 'Missing parameters', status: 400})
    }
    const user = await User.findOne({
			where: { [Op.and]: [{ email: req.body.email }, { deletionDate: null }] },
		})
    if (!user) {
        return respond(res, {message: 'User not found', status: 400})
    } else {
        if (!user.checkPassword(req.body.password)) {
            return respond(res, {message: 'Invalid password', status: 401})
        }
        const token = new Token(user, 'web', 'local')
        await token.register()
        return respond(res, {message: `${user.email} signed in.`, data: {token: token.string}, status: 200})
    }
})

export default authRouter