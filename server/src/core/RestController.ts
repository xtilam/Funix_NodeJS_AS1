import { Request, Response } from "express";
import { RestControllerAPI } from "./RestControllerAPI";
import { RequestHandler } from "express-serve-static-core";

export class RestController<T = {}> {
  handlers = {} as T;

  async<K extends string>(
    key: K,
    callback: (
      req: Request,
      res: Response,
      api: RestControllerAPI
    ) => Promise<any>
  ) {
    this.handlers[key as any] = ((req, res) => {
      const api = new RestControllerAPI(req, res);
      callback(req, res, api)
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
}
