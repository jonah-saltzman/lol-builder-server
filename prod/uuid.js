"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidUuidError = exports.UUID = void 0;
const perf_hooks_1 = require("perf_hooks");
class UUID {
    constructor(str) {
        this.str = str || UUID.newUuid().toString();
        let reg = new RegExp('[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}', 'i');
        if (!reg.test(this.str)) {
            throw new InvalidUuidError();
        }
    }
    toString() {
        return this.str;
    }
    static newUuid() {
        const v = 4;
        let d = new Date().getTime();
        d += perf_hooks_1.performance.now();
        let uuid = ('xxxxxxxx-xxxx-' +
            v.toString().substring(0, 1) +
            'xxx-yxxx-xxxxxxxxxxxx').replace(/[xy]/g, (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        });
        return new UUID(uuid);
    }
}
exports.UUID = UUID;
class InvalidUuidError extends Error {
    constructor(m) {
        super(m || 'Error: invalid UUID !');
        Object.setPrototypeOf(this, InvalidUuidError.prototype);
    }
}
exports.InvalidUuidError = InvalidUuidError;
