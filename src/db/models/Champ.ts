import {
	Column,
	Model,
	Table,
	ForeignKey,
	BelongsTo,
	PrimaryKey,
	HasMany,
} from 'sequelize-typescript'

import { Stat } from './Stat'

@Table({ updatedAt: false, createdAt: false, paranoid: false })
export class Champ extends Model {
	@PrimaryKey
	@Column
	champId: number

	@Column
	champName: string

	@Column
	title: string

	@Column
	icon: string

	@Column
	resourceType: string

	@HasMany(() => ChampStat)
    stats: ChampStat[]
}

@Table({ updatedAt: false, createdAt: false, paranoid: false })
export class ChampStat extends Model {
	@ForeignKey(() => Stat)
	@Column({ primaryKey: true })
	statId: number

	@ForeignKey(() => Champ)
	@Column({ primaryKey: true })
	champId: number

	@Column
	flat: number

	@Column
	percent: number

	@Column
	perLevel: number

	@Column
	percentPerLevel: number

    @BelongsTo(() => Champ, 'champId')
    champ: Champ
}