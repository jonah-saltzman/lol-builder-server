import {
	Column,
	DataType,
	Model,
	Table,
	ForeignKey,
	BelongsTo,
    PrimaryKey,
    HasMany,
} from 'sequelize-typescript'

type Stat = {
    name: string
    modifiers: Array<Modifier>
}

type Modifier = {
    type: 'flat' | 'percent' | 'perLevel' | 'percentPerLevel' | 'percentBase' | 'percentBonus'
    value: number
}

@Table
export class Item extends Model {
	@PrimaryKey
	@Column
	itemId: number

	@Column
	name: string

	@Column
	colloq: string

	@Column
	plaintext: string

	@Column
	baseGold: number

	@Column
	totalGold: number

	@Column
	stats: string
}
