export default abstract class BaseValidationRules {
  #error: string = "";
  #hasError: boolean = false;
  #value = null;
  #stringValue: string = null;
  #numberValue: number = null;

  constructor(value: any) {
    this.#value = value;
  }
  get error() {
    return this.#error;
  }
  get value() {
    return this.#value;
  }
  get hasError() {
    return this.#hasError;
  }
  stringValue() {
    this.stringValue = function () {
      return this.#stringValue;
    };
    this.#stringValue = this.#value + "";
    return this.#stringValue;
  }
  numberValue() {
    this.numberValue = function () {
      return this.#numberValue;
    };
    this.#numberValue = Number(this.#value);
    return this.#numberValue;
  }
  disableAutoThrowError() {
    this.setError = function (err) {
      this.#error = err;
      this.#hasError = false;
      return this;
    };
    return this;
  }
  convertTrim() {
    const val = this.stringValue();
    this.#value = val.trim();
    delete this.stringValue;
    return this;
  }
  clearError() {
    this.#error = "";
    this.#hasError = false;
  }
  regexValidate(regex: RegExp, error: string, value = this.stringValue()) {
    const matched = value.match(regex);
    if (matched) return this;
    return this.setError(error);
  }
  setError(err: string): typeof this {
    this.#error = err;
    this.#hasError = false;
    throw err;
  }
}
