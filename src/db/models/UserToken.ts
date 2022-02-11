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
