"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const config_1 = __importStar(require("./db/config"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
require("./custom.ts");
const auth_1 = __importDefault(require("./routes/auth"));
const tokens_1 = require("./tokens");
const updater_1 = __importDefault(require("./updater"));
const Item_1 = require("./db/models/Item");
const Champ_1 = require("./db/models/Champ");
const builds_1 = __importDefault(require("./routes/builds"));
const Stat_1 = require("./db/models/Stat");
const items_1 = __importDefault(require("./routes/items"));
const champs_1 = __importDefault(require("./routes/champs"));
//import { SocketInit } from './socket.io'
const PORT = parseInt(process.env.PORT || '6000');
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, { cors: { origin: '*' } });
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.get('/items', (req, res) => {
    if (config_1.openCache.has('allItems')) {
        console.log('items in cache');
        res.json(config_1.openCache.get('allItems'));
    }
    else {
        Item_1.Item.findAll({ raw: true }).then((items) => {
            console.log('items not in cache');
            res.json(items);
        });
    }
});
app.get('/champs', (req, res) => {
    if (config_1.openCache.has('allChamps')) {
        console.log('champs in cache');
        res.json(config_1.openCache.get('allChamps'));
    }
    else {
        Champ_1.Champ.findAll({ raw: true }).then((champs) => {
            console.log('champs not in cache');
            res.json(champs);
        });
    }
});
app.use('/auth', auth_1.default);
app.use('/item', items_1.default);
app.use('/champ', champs_1.default);
app.use(tokens_1.requireToken);
app.get('/signout', auth_1.default);
app.patch('/changepass', auth_1.default);
app.use('/', builds_1.default);
config_1.default
    .sync()
    .then((seq) => {
    console.log('successfully synced mySQL db');
    (0, updater_1.default)()
        .then((res) => {
        console.log(res);
        Item_1.Item.findAll({ raw: true }).then((items) => {
            config_1.openCache.set('allItems', items);
        });
        Champ_1.Champ.findAll({ raw: true }).then((champs) => {
            config_1.openCache.set('allChamps', champs);
        });
        Stat_1.Stat.findAll({ raw: true }).then((stats) => {
            config_1.openCache.set('stats', stats);
        });
    })
        .catch(console.log);
})
    .then(() => {
    server.listen(PORT, () => {
        console.log('Listening on port ', PORT);
    });
});
