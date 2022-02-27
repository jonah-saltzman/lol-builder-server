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
const config_1 = __importDefault(require("../db/config"));
const buildChampQuery = (buildId) => {
    const id = buildId.toString();
    return `SELECT Champs.champId, ChampStats.*, FROM Builds
        INNER JOIN Champs
        on Champs.champId = Builds.champId
        INNER JOIN ChampStats
        on ChampStats.champId = Builds.champId
        AND Builds.userId = ${id};`;
    // INNER JOIN ItemStats
    // on ItemStats.itemId = Items.itemId
};
const buildItemQuery = (buildId) => {
    const id = buildId.toString();
    return `SELECT Builds.buildId, Items.itemId, Champs.champId, ChampStats.*, FROM Builds
        INNER JOIN ItemInBuilds as ItemJoins
        on ItemJoins.buildId = Builds.buildId
        INNER JOIN Items
        on Items.itemId = ItemJoins.itemId
        INNER JOIN Champs
        on Champs.champId = Builds.champId
        INNER JOIN ChampStats
        on ChampStats.champId = Builds.champId
        AND Builds.userId = ${id};`;
    // INNER JOIN ItemStats
    // on ItemStats.itemId = Items.itemId
};
const getBuildById = (buildId) => __awaiter(void 0, void 0, void 0, function* () {
    const [results, metadata] = yield config_1.default.query(buildChampQuery(buildId));
    const uniqueItems = [];
    for (const result of results) {
    }
});
getBuildById(1);
