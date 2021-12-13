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
/**
 * 中间件
 */
class Middleware {
    constructor() {
        this.middlewares = [];
        /**
         * 添加中间件
         * @param middleware
         */
        this.addMiddleware = (middleware) => {
            this.middlewares.push(middleware);
        };
        /**
         * 执行中间件
         * @param req
         * @param res
         */
        this.excuteMiddleware = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //拷贝一份中间件
            const chache = this.middlewares.map((e) => e);
            /**
             * 下一个中间件
             */
            const handelNext = () => __awaiter(this, void 0, void 0, function* () {
                const middleware = chache.shift();
                yield (middleware === null || middleware === void 0 ? void 0 : middleware(req, res, handelNext));
            });
            yield handelNext();
        });
        /**
         * 处理请求
         * @param req
         * @param res
         */
        this.handelRequest = (req, res) => {
            this.excuteMiddleware(req, res);
        };
    }
}
exports.default = Middleware;
//# sourceMappingURL=Middleware.js.map