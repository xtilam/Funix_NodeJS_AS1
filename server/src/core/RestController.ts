import { Request, Response } from "express";
import { RestControllerAPI } from "./RestControllerAPI";
import { RequestHandler } from "express-serve-static-core";

/**
 * class giúp tạo ra các request handler async
 */

export class RestController<T = {}> {
  handlers = {} as T;

  addAsyncHandler<K extends string>(
    key: K,
    handler: RestControllerAsyncHandler
  ) {
    this.handlers[key as any] = ((req, res) => {
      const api = new RestControllerAPI(req, res);
      handler(req, res, api)
        .then((result) => {
          if (api.isDone) return;
          try {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(result));
          } catch (error) {
            res.status(500).json({ message: `${error}` });
          }
        })
        .catch((err) => {
          if (api.isDone) return;
          res.status(500).json({ message: `${err}` });
        });
    }) as RequestHandler;

    return this as RestController<T & { [n in K]: any }>;
  }
  addAsyncHandlerFromObject<
    O extends Record<string, RestControllerAsyncHandler>
  >(handlers: O) {
    for (const [name, handler] of Object.entries(handlers)) {
      this.addAsyncHandler(name, handler);
    }
    return this as RestController<T & Record<keyof O, any>>;
  }
}

// ----------------------------------------------
export type RestControllerAsyncHandler = (
  req: Request,
  res: Response,
  api: RestControllerAPI
) => Promise<any>;
