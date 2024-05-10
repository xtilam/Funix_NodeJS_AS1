declare type AcceptAll<T> = T & { [n: string]: any };

interface Promise<T> {
  safe<D = any>(): Promise<SafePromiseResult<T, D>>;
}

interface PromiseConstructor {
  safe<T>(promise: Promise<T>): Promise<SafePromiseResult<T>>;
  safeAll<T extends readonly unknown[] | []>(
    values: T
  ): Promise<{ readonly [P in keyof T]: SafePromiseResult<Awaited<T[P]>> }>;
}

type SafePromiseResult<R, E> = [result: R, error: E];
