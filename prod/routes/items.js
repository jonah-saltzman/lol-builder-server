"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const items_1 = require("../dal/items");
const responder_1 = require("../responder");
const config_1 = require("../db/config");
const itemRouter = express_1.default.Router();
itemRouter.get('/:itemId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cacheitem = config_1.itemCache.get(req.params.itemId);
    if (cacheitem) {
        (0, responder_1.respond)(res, { data: [cacheitem], status: 200 });
        return;
    }
    const item = yield items_1.Item.find(parseInt(req.params.itemId));
    if (item) {
        (0, responder_1.respond)(res, { data: [item], status: 200 });
        config_1.itemCache.set(item.id, item);
    }
    else {
        (0, responder_1.respond)(res, { status: 404 });
    }
}));
itemRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requested = req.body.items;
        const items = (yield Promise.all(requested.map(id => items_1.Item.find(id)))).filter(items_1.itemFilter);
        const response = items.map(item => ({
            info: {
                itemId: item.id,
                itemName: item.name,
                icon: item.icon
            },
            stats: item.statsArray()
        }));
        res.json(response).status(response.length === 0 ? 404 : 200);
    }
    catch (e) {
        console.error(e);
        res.status(500).send();
    }
}));
exports.default = itemRouter;
