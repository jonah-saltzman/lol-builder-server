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

@Table({paranoid: false, updatedAt: false, createdAt: false})
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

    @HasMany(() => ItemInto, {foreignKey: 'fromItem'})
    buildsInto: number

    @Column
    legendary: boolean

    @Column
    mythic: boolean

    @Column
    icon: string
}

@Table({ updatedAt: false, createdAt: false, paranoid: false })
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