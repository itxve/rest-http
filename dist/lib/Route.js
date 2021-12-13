"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_to_regexp_1 = require("path-to-regexp");
/**
 * 路由
 */
class Route {
    constructor(path, handel) {
        /**
         * path匹配到的
         */
        this._params = {};
        this.match = (path) => {
            let result = this._pathRegex.exec(path);
            if (result) {
                Object.keys(this._params).forEach((k, index) => {
                    this._params[k] = result[++index];
                });
                return true;
            }
            return false;
        };
        if (!path || !handel) {
            throw new Error("path or handel is empty");
        }
        this._handel = handel;
        const keys = [];
        this._pathRegex = (0, path_to_regexp_1.pathToRegexp)(path, keys);
        keys.forEach(({ name }) => (this._params[name] = ""));
    }
    get params() {
        return this._params;
    }
    get handel() {
        return this._handel;
    }
    get pathRegex() {
        return this._pathRegex;
    }
}
exports.default = Route;
//# sourceMappingURL=Route.js.map