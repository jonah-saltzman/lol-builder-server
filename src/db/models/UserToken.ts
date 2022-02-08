import {
	Column,
	DataType,
	Model,
	Table,
    ForeignKey,
    BelongsTo
} from 'sequelize-typescript'
import { User } from './User'
import { Token } from '../../tokens'

@Table
export class UserToken extends Model {
	@ForeignKey(() => User)
	@Column
	userId: number

	@BelongsTo(() => User, 'userId')
	user: User

	@Column
	tokenString: string

	@Column
	valid: boolean

	@Column(DataType.TEXT)
	tokenId: string

    async invalidate(): Promise<boolean> {
        try {
            this.setDataValue('valid', false)
            await this.save()
            return true
        } catch {
            return false
        }
    }
}

export const createToken = async (user: User, token: Token): Promise<UserToken | null> => {
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

export const findTokenByUuid = async (token: string): Promise<UserToken | null> => {
    try {
        return await UserToken.findOne({where: {tokenId: token}})
    } catch {
        return null
    }
}