import {
	Column,
	Model,
	Table,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript'
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
	champion: number

	@Column
	Item1: number

	@Column
	Item2: number

	@Column
	Item3: number

	@Column
	Item4: number

	@Column
	Item5: number

	@Column
	Item6: number

	@Column
	name: string

	allItems(): number[] {
		return [
			this.Item1,
			this.Item2,
			this.Item3,
			this.Item4,
			this.Item5,
			this.Item6,
		]
	}
}