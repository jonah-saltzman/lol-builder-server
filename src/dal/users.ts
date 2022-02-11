import { User } from "../db/models/User"
import { Op } from "sequelize"

export const findUserByEmail = async (email: string): Promise<User | null> => {
	try {
		return await User.findOne({
			where: { [Op.and]: [{ email: email }, { deletionDate: null }] },
		})
	} catch {
		return null
	}
}

export const findUserById = async (id: number): Promise<User | null> => {
	try {
		return await User.findByPk(id)
	} catch {
		return null
	}
}

export const newLocalUser = async (
	email: string,
	password: string
): Promise<User | null> => {
	try {
		if (await findUserByEmail(email)) {
			return null
		}
		const newUser = User.build({ email: email })
		if (newUser.newPassword(password)) {
			await newUser.save()
			return newUser
		} else {
			return null
		}
	} catch (e) {
		console.error(e)
		return null
	}
}