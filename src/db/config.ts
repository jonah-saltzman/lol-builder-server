import { Sequelize } from "sequelize-typescript";
import { User } from "./models/User";

const dbName = process.env.RDS_NAME as string
const dbUser = process.env.RDS_USER as string
const dbHost = process.env.RDS_HOST as string
const dbPass = process.env.RDS_PASSWORD



const sequelize = new Sequelize(dbName, dbUser, dbPass, {host: dbHost, dialect: 'mysql', models: [User]})

sequelize.afterInit(() => {
	console.log('connected to mySQL')
})

export default sequelize