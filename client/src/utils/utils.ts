export const utils = {
  delay(time = 1000) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  },
  catchError<T>(callback: () => T): [value: T, error: any] {
    try {
      return [callback(), undefined];
    } catch (error) {
      return [undefined, error || new Error("Execute error")];
    }
  },
  random(start: number, end: number, rounded = true) {
    let result = Math.random() * (end - start + 1) + start;
    return rounded ? Math.floor(result) : result;
  },
  isPromiseResolved(p: Promise<any>) {
    let isResolved = false;
    p.then(() => (isResolved = true));
    return isResolved;
  },
  delayPromise<T>(promise: Promise<T>, time: number): Promise<T> {
    return new Promise<any>(async (resolve, reject) => {
      let isEndTime = false;
      let data: T;
      let hasData = false;

      setTimeout(() => {
        if (hasData) resolve(data);
        isEndTime = true;
      }, time);

      try {
        data = await promise;
        hasData = true;
        if (!isEndTime) return;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  },
  convertMoney(number = 0 as number | string, unit = "VND") {
    number = Number(number) || 0;
    const numString = number + "";
    const length = numString.length;
    const first = length % 3 || 3;
    let numStack = "";
    numStack += numString.substring(0, first);
    for (let i = first; i < length; i += 3) {
      numStack += "." + numString.substring(i, i + 3);
    }
    return numStack + (unit ? " " + unit : "");
  },
  nextDOMID(): string {
    let id = 0;
    utils.nextDOMID = function () {
      const currentId = ++id;
      return "_gid_" + currentId;
    };
    return utils.nextDOMID();
  },
};
