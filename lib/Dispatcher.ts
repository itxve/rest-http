import { parse } from "url";
import { readFile, existsSync, stat } from "fs";
import { resolve } from "path";
import {
  WrapIncomingMessage,
  WrapServerResponse,
  RouteType,
  Config,
} from "./types";
import Middleware from "./Middleware";
import Route from "./Route";
/**
 * 路由分发分发器
 */
export default class Dispatcher {
  private config: Config;
  private routes: RouteType<Route> = {};
  private middleware = new Middleware();

  /**
   * 初始化默认中间件
   */
  defaultMiddleware = async () => {
    //文件处理器
    this.middleware.addMiddleware(async (req, res, next) => {
      const url = parse(req.url!, true);
      const pathname = url.pathname!;
      const file = await this.sendFile(pathname);
      if (file.has) {
        res.end(file.data);
        return;
      } else {
        //自己无法处理交给下一个处理
        next();
      }
    });
    //路由中间件
    this.middleware.addMiddleware(async (req, res, next) => {
      const method = req.method?.toUpperCase();
      const url = parse(req.url!, true);
      const pathname = url.pathname!;
      let matched = false;
      //路由匹配分发
      this.routes[method!].some(({ match, handel, params }) => {
        if (match(pathname)) {
          //解析参数放入
          req.params = { ...req.params, ...params, ...url.query };

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
    });

    //都不能处理的话就返回 Not Found
    this.middleware.addMiddleware(async (req, res, next) => {
      res.writeHead(404, "Resource Not Found");
      res.end();
    });
  };

  constructor(config: Config) {
    this.config = config;
    this.defaultMiddleware();
  }

  /**
   * 发送文件
   * @param path
   * @param res
   */
  sendFile = (path: string): Promise<{ has: boolean; data: any }> => {
    return new Promise((s, f) => {
      if (path === "/") {
        path = resolve(this.config.rootPath) + "/index.html";
      } else {
        path = resolve(this.config.rootPath) + path;
      }
      console.log("cureent Path", path);
      if (existsSync(path)) {
        stat(path, (fail, des) => {
          if (!fail) {
            if (!des.isDirectory()) {
              readFile(path, (err, data) => {
                if (!err) {
                  s({ has: true, data });
                }
              });
            } else {
              s({ has: false, data: "" });
            }
          }
        });
      } else {
        s({ has: false, data: "" });
      }
    });
  };

  /**
   * 注册
   * @param method
   * @param route
   */
  register = (method: string, route: Route) => {
    if (this.routes[method]) {
      this.routes[method].push(route);
    } else {
      this.routes[method] = [];
      this.routes[method].push(route);
    }
  };

  //建议使用中间件处理
  dispatch = async (req: WrapIncomingMessage, res: WrapServerResponse) => {
    try {
      this.middleware.handelRequest(req, res);
    } catch (error) {
      console.log("error", error);
    }
  };
}
