import { UserToken } from "../db/models/UserToken"
import { Token } from "../tokens"
import { User } from "../db/models/User"

export const createToken = async (
	user: User,
	token: Token
): Promise<UserToken | null> => {
	try {
		const newToken = await UserToken.create({
			user: user,
			tokenString: token.string,
			userId: user.id,
			valid: true,
			tokenId: token.id.toString(),
		})
		return newToken
	} catch (e) {
		console.error(e)
		return null
	}
}

export const findTokenByUuid = async (
	token: string
): Promise<UserToken | null> => {
	try {
		return await UserToken.findOne({ where: { tokenId: token } })
	} catch {
		return null
	}
}
