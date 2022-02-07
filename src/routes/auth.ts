import express from 'express'
import { User } from '../db/models/User'
import { Op } from 'sequelize'
import { respond } from '../responder'

const authRouter = express.Router()

authRouter.post('/signup', async (req, res) => {
    const user = await User.findOne({ where: {[Op.and]: [{email: req.body.email}, {deletionDate: null}]} })
    console.log('user: ')
    console.log(user)
    if (user) {
        return respond(res, { message: 'Account exists', status: 409 })
    }
    const newUser = User.build({email: req.body.email})
    if (newUser.newPassword(req.body.password)) {
        await newUser.save()
        return respond(res, {message: 'Account created', data: {email: newUser.email}, status: 201})
    }
    return respond(res, { status: 500 })
})

export default authRouter