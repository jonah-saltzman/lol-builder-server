import { Dialect, Sequelize } from "sequelize";

const dbName = process.env.RDS_NAME as string
const dbUser = process.env.RDS_USER as string
const dbHost = process.env.RDS_HOST as string
const dbDriver = process.env.RDS_DIALECT as Dialect
const dbPass = process.env.RDS_PASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPass, {host: dbHost, dialect: dbDriver})

export default sequelize