Promise.prototype.safe = function () {
  return this.then(
    (value) => [value, undefined],
    (error) => [undefined, error || new Error("Promise error")],
  );
};
Promise.safe = function (promise: any) {
  if (promise instanceof Promise) return promise.safe();
  return promise;
};
Promise.safeAll = function (values) {
  return Promise.all(values.map(Promise.safe as any)) as any;
};
