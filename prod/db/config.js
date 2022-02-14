"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.champCache = exports.itemCache = exports.openCache = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const Build_1 = require("./models/Build");
const Champ_1 = require("./models/Champ");
const Item_1 = require("./models/Item");
const Stat_1 = require("./models/Stat");
const User_1 = require("./models/User");
const UserToken_1 = require("./models/UserToken");
const node_cache_1 = __importDefault(require("node-cache"));
const dbName = process.env.RDS_NAME;
const dbUser = process.env.RDS_USER;
const dbHost = process.env.RDS_HOST;
const dbPass = process.env.RDS_PASSWORD;
const sequelize = new sequelize_typescript_1.Sequelize(dbName, dbUser, dbPass, { host: dbHost, dialect: 'mysql', models: [User_1.User, UserToken_1.UserToken, Item_1.Item, Build_1.Build, Item_1.ItemInto, Stat_1.Stat, Stat_1.ItemStat, Champ_1.Champ, Champ_1.ChampStat, Build_1.ItemInBuild], logging: false });
exports.openCache = new node_cache_1.default({ useClones: true, checkperiod: 0, stdTTL: 0 });
exports.itemCache = new node_cache_1.default({
    useClones: false,
    checkperiod: 3600,
    stdTTL: 43200,
});
exports.champCache = new node_cache_1.default({
    useClones: false,
    checkperiod: 3600,
    stdTTL: 43200,
});
exports.default = sequelize;
