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
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const fs_1 = require("fs");
const path_1 = require("path");
const Middleware_1 = require("./Middleware");
/**
 * 路由分发分发器
 */
class Dispatcher {
    constructor(config) {
        this.routes = {};
        this.middleware = new Middleware_1.default();
        /**
         * 初始化默认中间件
         */
        this.defaultMiddleware = () => __awaiter(this, void 0, void 0, function* () {
            //文件处理器
            this.middleware.addMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                const url = (0, url_1.parse)(req.url, true);
                const pathname = url.pathname;
                const file = yield this.sendFile(pathname);
                if (file.has) {
                    res.end(file.data);
                    return;
                }
                else {
                    //自己无法处理交给下一个处理
                    next();
                }
            }));
            //路由中间件
            this.middleware.addMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const method = (_a = req.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                const url = (0, url_1.parse)(req.url, true);
                const pathname = url.pathname;
                let matched = false;
                //路由匹配分发
                this.routes[method].some(({ match, handel, params }) => {
                    if (match(pathname)) {
                        //解析参数放入
                        req.params = Object.assign(Object.assign(Object.assign({}, req.params), params), url.query);
                        handel(req, res);
                        matched = true;
                        return matched;
                    }
                    return matched;
                });
                //处理不了交给下一个处理器
                if (!matched) {
                    next();
                }
            }));
            //都不能处理的话就返回 Not Found
            this.middleware.addMiddleware((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                res.writeHead(404, "Resource Not Found");
                res.end();
            }));
        });
        /**
         * 发送文件
         * @param path
         * @param res
         */
        this.sendFile = (path) => {
            return new Promise((s, f) => {
                if (path === "/") {
                    path = (0, path_1.resolve)(this.config.rootPath) + "/index.html";
                }
                else {
                    path = (0, path_1.resolve)(this.config.rootPath) + path;
                }
                console.log("cureent Path", path);
                if ((0, fs_1.existsSync)(path)) {
                    (0, fs_1.stat)(path, (fail, des) => {
                        if (!fail) {
                            if (!des.isDirectory()) {
                                (0, fs_1.readFile)(path, (err, data) => {
                                    if (!err) {
                                        s({ has: true, data });
                                    }
                                });
                            }
                            else {
                                s({ has: false, data: "" });
                            }
                        }
                    });
                }
                else {
                    s({ has: false, data: "" });
                }
            });
        };
        /**
         * 注册
         * @param method
         * @param route
         */
        this.register = (method, route) => {
            if (this.routes[method]) {
                this.routes[method].push(route);
            }
            else {
                this.routes[method] = [];
                this.routes[method].push(route);
            }
        };
        //建议使用中间件处理
        this.dispatch = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                this.middleware.handelRequest(req, res);
            }
            catch (error) {
                console.log("error", error);
            }
        });
        this.config = config;
        this.defaultMiddleware();
    }
}
exports.default = Dispatcher;
//# sourceMappingURL=Dispatcher.js.map