import {
	Column,
	Model,
	Table,
	ForeignKey,
	PrimaryKey,
} from 'sequelize-typescript'
import { Item } from './Item'

@Table({paranoid: false})
export class Stat extends Model {
	@PrimaryKey
	@Column
	statId: number

	@Column
	statName: string

    @Column
    alias: string
}

@Table({ updatedAt: false, createdAt: false, paranoid: false })
export class ItemStat extends Model {
	@ForeignKey(() => Stat)
	@Column({ primaryKey: true })
	statId: number

	@ForeignKey(() => Item)
	@Column({ primaryKey: true })
	itemId: number

	@Column
	flat: number

	@Column
	percent: number

	@Column
	perLevel: number

	@Column
	percentPerLevel: number

	@Column
	percentBase: number

	@Column
	percentBonus: number

	@Column
	unique: boolean

	@Column({ primaryKey: true })
	named: string

	@Column
	passive: boolean
}

// @Table
// export class ChampStat extends Model {
    
// }