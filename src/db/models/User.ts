import { Column, CreatedAt, DataType, DeletedAt, HasMany, Model, Table, UpdatedAt } from "sequelize-typescript";
import bcrypt from 'bcrypt'

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
    // @HasMany(() => Build)
    // builds: Build[]
}