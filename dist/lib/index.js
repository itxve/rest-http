"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpServer = void 0;
const http_1 = require("http");
const Route_1 = require("./Route");
const Dispatcher_1 = require("./Dispatcher");
/**
 * Http Serve
 */
class HttpServer {
    constructor(config) {
        this._serve = (0, http_1.createServer)();
        /**
         *
         * @param config 合并配置
         */
        this.mergeConfig = (config) => {
            this.config = Object.assign({
                rootPath: "public",
            }, config);
        };
        /**htt
         * 开启服务
         * @param port
         * @param handel
         * @returns
         */
        this.start = (port, handel) => {
            return this._serve.listen(port, handel);
        };
        /**
         * 关闭服务
         * @param callback
         */
        this.off = (callback) => {
            this._serve.close(callback);
        };
        this.get = (path, handel) => {
            this.dispachter.register("GET", new Route_1.default(path, handel));
        };
        this.post = (path, handel) => {
            this.dispachter.register("POST", new Route_1.default(path, handel));
        };
        this.put = (path, handel) => {
            this.dispachter.register("PUT", new Route_1.default(path, handel));
        };
        this.delete = (path, handel) => {
            this.dispachter.register("DELETE", new Route_1.default(path, handel));
        };
        this.mergeConfig(config);
        this.dispachter = new Dispatcher_1.default(this.config);
        this._serve.on("request", (req, res) => {
            this.dispachter.dispatch(req, res);
        });
    }
    get serve() {
        return this._serve;
    }
}
exports.HttpServer = HttpServer;
//# sourceMappingURL=index.js.map