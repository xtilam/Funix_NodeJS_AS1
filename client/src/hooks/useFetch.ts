import { useState } from "react";

export function useFetch<T extends any>(fetchCallback: () => Promise<T>) {
  const [isLoadding, setLoadding] = useState(false);
  const [error, setError] = useState();

  const getData: () => Promise<T> = async () => {
    if (isLoadding) return;
    setError(null);
    setLoadding(true);

    const [resp, error] = await fetchCallback().safe();
    setLoadding(false);
    if (error) throw error;
    return resp;
  };

  return FetchArrayResult.init(getData, isLoadding, error);
}

class FetchArrayResult<T> extends Array {
  static init<T>(...args: ResultArray<T>) {
    const result = new FetchArrayResult();
    Object.assign(result, args);
    return result as any as FetchArrayResult<T> & ResultArray<T>;
  }
  get getData() {
    return this[0];
  }
  get isLoadding() {
    return this[2];
  }
  get error() {
    return this[3];
  }
}

type ResultArray<T> = readonly [
  getData: () => Promise<T>,
  isLoadding: boolean,
  error: any
];
