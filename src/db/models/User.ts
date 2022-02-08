import { BeforeSave, Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import bcrypt from 'bcrypt'
import { UUID } from '../../uuid';
import { UserToken } from "./UserToken";
import { Op } from 'sequelize'
import { Build } from "./Build";

@Table
export class User extends Model {
	@Column
	email: string

	@Column
	password: string

	@CreatedAt
	creationDate: Date

	@UpdatedAt
	updatedOn: Date

	@DeletedAt
	deletionDate: Date

	@Column(DataType.TEXT)
	uuid: UUID

	@HasMany(() => UserToken, 'userId')
	tokens: UserToken[]

	@HasMany(() => Build, 'buildId')
	builds: Build[]

	checkPassword(pass: string): boolean {
		return bcrypt.compareSync(pass, this.getDataValue('password'))
	}

	changePassword(oldPass: string, newPass: string): boolean {
		if (bcrypt.compareSync(oldPass, this.getDataValue('password'))) {
			this.setDataValue('password', bcrypt.hashSync(newPass, 10))
			return true
		}
		return false
	}

	newPassword(pass: string): boolean {
		if (this.getDataValue('password')) {
			return false
		}
		this.setDataValue('password', bcrypt.hashSync(pass, 10))
		return true
	}

	@BeforeSave({ name: 'addUuidHook' })
	static addUuidHook(user: User) {
		if (!user.getDataValue('uuid')) {
			user.setDataValue('uuid', new UUID().toString())
		}
	}
	// @HasMany(() => Build)
	// builds: Build[]
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
    try {
        return await User.findOne({
			where: { [Op.and]: [{ email: email }, { deletionDate: null }] },
		})
    } catch {
        return null
    }
}

export const findUserById = async (id: number): Promise <User | null> => {
    try {
        return await User.findByPk(id)
    } catch {
        return null
    }
}

export const newLocalUser = async (email: string, password: string): Promise<User | null> => {
    try {
        if (await findUserByEmail(email)) {
            return null
        }
        const newUser = User.build({email: email})
        if (newUser.newPassword(password)) {
            await newUser.save()
            return newUser
        } else {
            return null
        }
    } catch(e) {
        console.error(e)
        return null
    }
}