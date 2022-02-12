import { Sequelize } from "sequelize-typescript";
import { Build, ItemInBuild } from "./models/Build";
import { Champ, ChampStat } from "./models/Champ";
import { Item, ItemInto } from "./models/Item";
import { ItemStat, Stat } from "./models/Stat";
import { User } from "./models/User";
import { UserToken } from "./models/UserToken";
import NodeCache from "node-cache";

const dbName = process.env.RDS_NAME as string
const dbUser = process.env.RDS_USER as string
const dbHost = process.env.RDS_HOST as string
const dbPass = process.env.RDS_PASSWORD

const sequelize = new Sequelize(dbName, dbUser, dbPass, {host: dbHost, dialect: 'mysql', models: [User, UserToken, Item, Build, ItemInto, Stat, ItemStat, Champ, ChampStat, ItemInBuild], logging: false})
export const openCache = new NodeCache({useClones: true, checkperiod: 0, stdTTL: 0})
export const itemCache = new NodeCache({
	useClones: false,
	checkperiod: 3600,
	stdTTL: 43200,
})
export const champCache = new NodeCache({
	useClones: false,
	checkperiod: 3600,
	stdTTL: 43200,
})

export default sequelize