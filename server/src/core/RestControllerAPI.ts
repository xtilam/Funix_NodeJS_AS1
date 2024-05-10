import { Request, Response } from "express";

const defaultPaginationConfig = {
  page: 1,
  limit: 5,
  max: 20,
};

export class RestControllerAPI {
  res: Response;
  req: Request;

  private _query: RestControllerQueryAPI;
  private _body: RestControllerBodyAPI;
  private _isDone = false;

  constructor(req: Request, res: Response) {
    this.req = req;
    this.res = res;
  }
  // ----------------------------------------------
  get isDone() {
    return this._isDone;
  }
  get query() {
    return this._query || (this._query = new RestControllerQueryAPI(this));
  }
  get body() {
    return this._body || (this._body = new RestControllerBodyAPI(this));
  }
  // ----------------------------------------------
  error(message: string, code?: number) {
    this.res.status(code || 500).json({ message: `${message}` });
    this._isDone = true;
    throw undefined;
  }
  getPagination(
    config = defaultPaginationConfig as Partial<typeof defaultPaginationConfig>,
    length: number
  ) {
    let page = Number(this.req.query.page);
    let limit = Number(this.req.query.limit);

    if (!isFinite(page)) {
      page = config.page || defaultPaginationConfig.page;
    }
    if (!isFinite(limit)) {
      limit = config.limit || defaultPaginationConfig.limit;
    }

    const max = config.max || defaultPaginationConfig.max;
    if (limit <= 0) limit = config.limit || defaultPaginationConfig.limit;
    if (limit > max) limit = max;
    if (page <= 0) page = 1;

    const start = (page - 1) * limit;
    const end = Math.min(start + limit, length);
    const totalPage = length / limit;

    return {
      page,
      limit,
      start,
      end,
      totalPage: Number.isInteger(totalPage)
        ? totalPage && totalPage - 1
        : Math.ceil(totalPage),
    };
  }
  paginationList<T>(
    data: T[],
    config = defaultPaginationConfig as Partial<typeof defaultPaginationConfig>
  ) {
    const { start, end, totalPage, page, limit } = this.getPagination(
      config,
      data.length
    );

    const results: T[] = [];

    for (let i = start; i < end; i++) {
      results.push(data[i]);
    }

    return {
      page: page,
      limit: limit,
      total_pages: totalPage,
      results: results,
    };
  }
}

class RestControllerQueryAPI {
  private _query: Object;
  private _rest: RestControllerAPI;

  constructor(rest: RestControllerAPI) {
    this._query = rest.req.query || {};
    this._rest = rest;
  }
  checkContain(name: string) {
    if (!this._query.hasOwnProperty(name))
      return this._rest.error(`Not found ${name} parram`, 400);
  }
  number(name: string, isForce = false): number {
    if (isForce) this.checkContain(name);
    const num = Number(this._query[name] || 0);
    if (!isFinite(num)) return 0;
    return num;
  }
}

class RestControllerBodyAPI {
  private _body: Object;
  private _rest: RestControllerAPI;

  constructor(rest: RestControllerAPI) {
    this._body = { ...rest.req.body };
    this._rest = rest;
  }
  checkContain(name: string) {
    if (!Object.hasOwnProperty.call(this._body, name))
      return this._rest.error(`Not found ${name} parram`, 400);
  }
  number(name: string, isForce = false) {
    if (isForce) this.checkContain(name);
    const num = Number(this._body[name] || 0);
    if (!isFinite(num)) return 0;
    return num;
  }
  string(name: string, isForce = false) {
    if (isForce) this.checkContain(name);
    let value = this._body[name] || "";
    if (typeof value !== "string") return value + "";
    return value;
  }
  trim(name: string, isForce = false): string {
    return this.string(name, isForce).trim();
  }
}
