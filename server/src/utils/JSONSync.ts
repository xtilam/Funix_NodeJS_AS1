import { promises } from "dns";
import { IPromiseObject } from "./promise-object-utils";
import { utils } from "./utils";
import fs from "fs/promises";

export class JSONWriteQuere<T> {
  private _filePath = "";
  private _defaultData: T = null;
  private _quereWrite: {
    promise: IPromiseObject<void>;
    data: T;
  };
  private _quereRead: IPromiseObject<T>;
  constructor(filePath: string, defaultData: T) {
    this._filePath = filePath;
    this._defaultData = defaultData;
  }
  async get(): Promise<T> {
    if (this._quereRead)
      return (await this._quereRead.promise) || this._defaultData;
    return await this._readJSON();
  }
  update(callback: (data: T, setData: (newData: T) => void) => any) {
    const execute = async () => {
      let handlerNext: (...args: any[]) => any = async (getData: Function) => {
        const donePromise = () => {
          if (hasError) return promise.reject(error);
          promise.resolve();
        };

        let data = (obj.data = await getData());
        let setData = (d) => (data = d);
        let error = null;
        let hasError = false;

        try {
          await callback(data, setData);
        } catch (error) {
          hasError = true;
          error = error;
        }

        if (this._quereWrite !== obj) return donePromise();
        await utils.delay(100);
        if (this._quereWrite !== obj) return donePromise();
        // console.log("write now!", data);
        await fs
          .writeFile(this._filePath, JSON.stringify(data), "utf-8")
          .safe();

        if (this._quereWrite === obj) {
          this._quereRead.resolve(data);
          this._quereWrite = null;
          this._quereRead = null;
        }

        return donePromise();
      };

      const obj = { promise, data: null };
      const beforeQuere = this._quereWrite;
      this._quereWrite = obj;

      if (!beforeQuere) return handlerNext(this._readJSON.bind(this));

      handlerNext = handlerNext.bind(0, () => beforeQuere.data);
      beforeQuere.promise.promise.then(handlerNext, handlerNext);
    };
    // ----------------------------------------------
    const promise = utils.initPromise();
    if (!this._quereRead) this._quereRead = utils.initPromise();
    execute();
    return promise.promise;
  }
  private async _readJSON() {
    return (await utils.readJSON(this._filePath)) || this._defaultData;
  }
}
