export class PromiseObject<T> extends Array implements IPromiseObject<T> {
  constructor() {
    super(3);
    this[0] = new Promise<T>((resolve, reject) => {
      this[1] = resolve;
      this[2] = reject;
    });
  }
  get data(): [
    Promise<T>,
    (value: T | PromiseLike<T>) => void,
    (reason?: any) => void,
  ] {
    return this as any;
  }
  get promise(): Promise<T> {
    return this[0];
  }
  get resolve(): (value: T | PromiseLike<T>) => void {
    return this[1];
  }
  get reject(): (reason?: any) => void {
    return this[2];
  }
}

export interface IPromiseObject<T> {
  get promise(): Promise<T>;
  get resolve(): (value: T | PromiseLike<T>) => void;
  get reject(): (reason?: any) => void;
  get data(): [
    Promise<T>,
    (value: T | PromiseLike<T>) => void,
    (reason?: any) => void,
  ];
}
