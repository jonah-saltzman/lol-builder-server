import {
	BeforeSave,
	Column,
	CreatedAt,
	DataType,
	DeletedAt,
	HasMany,
	HasOne,
	Model,
	Table,
	UpdatedAt,
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
}