"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketInit = void 0;
//import { Events } from './utils'
class SocketInit {
    constructor(io) {
        this.socketIo = io;
        this.socketIo.on('connection', (socket) => {
            console.log('user connected');
        });
        SocketInit._instance = this;
    }
    static getInstance() {
        return SocketInit._instance;
    }
}
exports.SocketInit = SocketInit;
