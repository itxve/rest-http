import { IncomingMessage, ServerResponse } from "http";

export type RequestListener = (
  req: WrapIncomingMessage,
  res: WrapServerResponse
) => void;

//扩展一个属性
export interface WrapIncomingMessage extends IncomingMessage {
  params?: {
    [key: string]: any;
  };
}

//扩展一个属性
export interface WrapServerResponse extends ServerResponse {}

export type RouteType<T> = Record<Uppercase<string>, Array<T>>;

export type MiddlewareType = (
  req: WrapIncomingMessage,
  res: WrapServerResponse,
  /**
   * 调用下一个中间件
   */
  next: () => void
) => Promise<void>;

export type Config = Readonly<{
  rootPath: string;
}>;
