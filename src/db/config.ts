import { Sequelize } from "sequelize-typescript";
import { Build } from "./models/Build";
import { Item, ItemInto } from "./models/Item";
import { ItemStat, Stat } from "./models/Stat";
import { User } from "./models/User";
import { UserToken } from "./models/UserToken";

const dbName = process.env.RDS_NAME as string
const dbUser = process.env.RDS_USER as string
const dbHost = process.env.RDS_HOST as string
const dbPass = process.env.RDS_PASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPass, {host: dbHost, dialect: 'mysql', models: [User, UserToken, Item, Build, ItemInto, Stat, ItemStat]})



export default sequelize