import fs from "fs/promises";
import { IPromiseObject, PromiseObject } from "./promise-object-utils";

export const utils = {
  delay(time = 1000) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  },
  readJSON: async (jsonPath: string) => {
    const [, checkAccessErr] = await fs.access(jsonPath).safe();
    if (checkAccessErr) return null;

    const [fileContent, readFileErr] = await fs
      .readFile(jsonPath, "utf-8")
      .safe();
    if (readFileErr) return null;

    try {
      return JSON.parse(fileContent);
    } catch (error) {
      return null;
    }
  },
  randomString(length = 10) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  },
  initPromise<T = void>() {
    return new PromiseObject() as IPromiseObject<T>;
  },
};
