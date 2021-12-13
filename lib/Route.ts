import { Key, pathToRegexp } from "path-to-regexp";
import { RequestListener } from "./types";
/**
 * 路由
 */
export default class Route {
  private _handel: RequestListener;
  private _pathRegex: RegExp;
  /**
   * path匹配到的
   */
  private _params: { [key: string]: string } = {};

  constructor(path: string, handel: RequestListener) {
    if (!path || !handel) {
      throw new Error("path or handel is empty");
    }
    this._handel = handel;
    const keys: Key[] = [];
    this._pathRegex = pathToRegexp(path, keys);
    keys.forEach(({ name }) => (this._params[name] = ""));
  }

  match = (path: string) => {
    let result = this._pathRegex.exec(path);
    if (result) {
      Object.keys(this._params).forEach((k, index) => {
        this._params[k] = result![++index];
      });
      return true;
    }
    return false;
  };

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
