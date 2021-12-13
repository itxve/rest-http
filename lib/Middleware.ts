import {
  MiddlewareType,
  WrapIncomingMessage,
  WrapServerResponse,
} from "./types";
/**
 * 中间件
 */
export default class Middleware {
  private middlewares: Array<MiddlewareType> = [];

  /**
   * 添加中间件
   * @param middleware
   */
  addMiddleware = (middleware: MiddlewareType) => {
    this.middlewares.push(middleware);
  };

  /**
   * 执行中间件
   * @param req
   * @param res
   */
  private excuteMiddleware = async (
    req: WrapIncomingMessage,
    res: WrapServerResponse
  ) => {
    //拷贝一份中间件
    const chache = this.middlewares.map((e) => e);
    /**
     * 下一个中间件
     */
    const handelNext = async () => {
      const middleware = chache.shift();
      await middleware?.(req, res, handelNext);
    };
    await handelNext();
  };

  /**
   * 处理请求
   * @param req
   * @param res
   */
  handelRequest = (req: WrapIncomingMessage, res: WrapServerResponse) => {
    this.excuteMiddleware(req, res);
  };
}
