import { createServer, Server } from "http";
import { RequestListener, Config } from "./types";
import Route from "./Route";
import Dispatcher from "./Dispatcher";

/**
 * Http Serve
 */
export class HttpServer {
  private config!: Config;

  private dispachter: Dispatcher;

  private _serve = createServer();

  /**
   *
   * @param config 合并配置
   */
  mergeConfig = (config?: Config) => {
    this.config = Object.assign(
      {
        rootPath: "public",
      },
      config
    );
  };

  constructor(config?: Config) {
    this.mergeConfig(config);
    this.dispachter = new Dispatcher(this.config);
    this._serve.on("request", (req, res) => {
      this.dispachter.dispatch(req, res);
    });
  }

  /**htt
   * 开启服务
   * @param port
   * @param handel
   * @returns
   */
  start = (port: number, handel?: () => void): Server => {
    return this._serve.listen(port, handel);
  };

  /**
   * 关闭服务
   * @param callback
   */
  off = (callback?: (err?: Error) => void) => {
    this._serve.close(callback);
  };

  get = (path: string, handel: RequestListener) => {
    this.dispachter.register("GET", new Route(path, handel));
  };

  post = (path: string, handel: RequestListener) => {
    this.dispachter.register("POST", new Route(path, handel));
  };

  put = (path: string, handel: RequestListener) => {
    this.dispachter.register("PUT", new Route(path, handel));
  };

  delete = (path: string, handel: RequestListener) => {
    this.dispachter.register("DELETE", new Route(path, handel));
  };

  get serve() {
    return this._serve;
  }
}
