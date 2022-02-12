import {
	Column,
	Model,
	Table,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript'
import { Item } from './Item'
import { User } from './User'

@Table
export class Build extends Model {
	@PrimaryKey
	@AutoIncrement
	@Column
	buildId: number

	@BelongsTo(() => User)
	user: User

	@ForeignKey(() => User)
	@Column
	userId: number

	@Column
	champId: number

	@Column
	buildName: string
}

@Table({ updatedAt: false, createdAt: false, paranoid: false, deletedAt: false })
export class ItemInBuild extends Model {
	@ForeignKey(() => Build)
	@Column({ autoIncrement: false, primaryKey: true })
	buildId: number

	@ForeignKey(() => Item)
	@Column({ autoIncrement: false, primaryKey: true })
	itemId: number

    @Column
    position: number

    @Column
    isPath: boolean
}