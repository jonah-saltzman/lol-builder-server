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
const builds_1 = __importDefault(require("../dal/builds"));
const responder_1 = require("../responder");
const items_1 = require("../dal/items");
const champ_1 = require("../dal/champ");
const builds_2 = require("../dal/builds");
const buildRouter = express_1.default.Router();
buildRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const builds = yield (0, builds_1.default)(req.user.id, { raw: true });
    console.log(builds);
    const response = builds.map(build => build.toObject());
    if (response.length === 0) {
        return (0, responder_1.respond)(res, { status: 404 });
    }
    else {
        return (0, responder_1.respond)(res, { data: response, status: 200 });
    }
}));
buildRouter.post('/new', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const champId = req.body.champId;
    const buildName = (_a = req.body.buildName) !== null && _a !== void 0 ? _a : null;
    const itemIds = (_b = req.body.items) !== null && _b !== void 0 ? _b : [];
    if (!champId) {
        (0, responder_1.respond)(res, { status: 400, message: 'Must specify champion' });
        return;
    }
    else {
        const champ = yield champ_1.Champ.find(champId);
        if (!champ) {
            (0, responder_1.respond)(res, { status: 404, message: 'Champ not found' });
        }
        else {
            try {
                const items = (yield Promise.all(itemIds.map(id => items_1.Item.find(id)))).filter(items_1.itemFilter);
                const newBuild = yield builds_2.Build.create({ items, champ, user: req.user.id, name: buildName });
                if (newBuild) {
                    (0, responder_1.respond)(res, { data: [newBuild.toObject()], status: 200 });
                    return;
                }
                else {
                    (0, responder_1.respond)(res, null);
                    return;
                }
            }
            catch (e) {
                console.error(e);
                (0, responder_1.respond)(res, null);
            }
        }
    }
}));
// req.body.buildId
// req.body.champId
// req.body.items
// req.body.buildName
buildRouter.patch('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    try {
        if (!req.body.buildId || req.body.buildId.length === 0)
            throw 400;
        const champId = req.body.champId;
        const itemIds = req.body.items;
        if (!champId || !itemIds)
            throw 400;
        const buildName = (_c = req.body.buildName) !== null && _c !== void 0 ? _c : null;
        const build = yield builds_2.Build.fromId(parseInt(req.body.buildId));
        const champ = yield champ_1.Champ.find(champId);
        const items = (yield Promise.all(itemIds.map(id => items_1.Item.find(id)))).filter(items_1.itemFilter);
        console.log(`build ${req.body.buildId} belongs to user ${build === null || build === void 0 ? void 0 : build.user}`);
        console.log(`the authenticated user is ${req.user.id}`);
        if (!build || !champ || items.length !== itemIds.length)
            throw 500;
        if (build.user !== req.user.id)
            throw 401;
        build.name = buildName;
        build.champ = champ;
        build.items = items;
        if (yield build.update()) {
            (0, responder_1.respond)(res, { status: 200, data: [build.toObject()] });
        }
        else {
            throw 500;
        }
    }
    catch (status) {
        if (typeof status === 'number') {
            (0, responder_1.respond)(res, { status });
        }
        else {
            (0, responder_1.respond)(res, null);
        }
    }
}));
buildRouter.delete('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.buildId || req.body.length === 0)
            throw 400;
        const build = yield builds_2.Build.fromId(parseInt(req.body.buildId));
        if (!build)
            throw 404;
        if (build.user !== req.user.id)
            throw 401;
        if (yield build.destroy()) {
            (0, responder_1.respond)(res, { status: 200 });
        }
        else {
            throw 500;
        }
    }
    catch (status) {
        if (typeof status === 'number') {
            (0, responder_1.respond)(res, { status });
        }
        else {
            (0, responder_1.respond)(res, null);
        }
    }
}));
exports.default = buildRouter;
