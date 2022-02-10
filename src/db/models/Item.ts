import {
	Column,
	DataType,
	Model,
	Table,
	ForeignKey,
	BelongsTo,
    PrimaryKey,
    HasMany,
    HasOne,
} from 'sequelize-typescript'

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

    @HasMany(() => ItemInto, {foreignKey: 'intoId'})
    buildsInto: number

    @Column
    legendary: boolean

    @Column
    mythic: boolean
}

@Table({ updatedAt: false, createdAt: false })
export class ItemInto extends Model {
	@ForeignKey(() => Item)
	@Column({ autoIncrement: false, primaryKey: true })
	fromItem: number

	@ForeignKey(() => Item)
	@Column({ autoIncrement: false, primaryKey: true })
	intoItem: number
}

export interface ItemProps {
    itemId?: number,
    name: string,
    colloq: string,
    plaintext: string,
    baseGold: number,
    totalGold: number
}