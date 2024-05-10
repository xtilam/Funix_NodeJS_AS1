import { useEffect, useMemo, useState } from "react";
import ValidationRule from "./ValidationRule";
import { utils } from "../utils/utils";

const { catchError } = utils;

export const useValidation = <T>(
  validationCallback: ValidationCallback,
  defaultValue: T
) => {
  const [input, updateState] = useMemo(
    () => InputValidation.init(validationCallback),
    []
  );
  updateState(useState(defaultValue), useState(""));
  return input as InputValidation<T>;
};

class InputValidation<T> {
  #value: T;
  #error = "";
  #setValue: UseStateSetter<T> = null;
  #setError: UseStateSetter<string> = null;
  #isInputed = false;
  #validation: ValidationCallback;

  constructor(validation: ValidationCallback) {
    this.#validation = validation;
  }
  static init(validation: ValidationCallback) {
    const input = new InputValidation(validation);
    return [input, input.#updateState.bind(input)];
  }
  get value() {
    return this.#value;
  }
  get error() {
    return this.#error;
  }
  get isInputed() {
    return this.#isInputed;
  }
  get inputProps() {
    return {
      value: this.#value,
      onChange: this.onChange,
      onBlur: this.onBlur,
    };
  }
  get setValue() {
    return this.#setValue;
  }
  onChange = ({ target }) => {
    this.#setValue(target.value);
    if (!this.#isInputed) return;
    this.validate(target.value);
  };
  onBlur = (evt) => {
    if (!evt.target.value) return;
    this.#isInputed = true;
  };
  validate(value = this.value) {
    this.#isInputed = true;
    const err = this.getValidateError(value);
    if (err) {
      this.#setError(err);
      return false;
    }
    if (this.#error) this.#setError("");
    return true;
  }
  getValidateError(value = this.#value) {
    const validationRule = new ValidationRule(value);
    const [result] = catchError(() => this.#validation(validationRule));
    if (result) validationRule.clearError();
    return validationRule.error;
  }
  reset(value?) {
    this.#isInputed = false;
    this.#setError("");
    if (value === undefined) return;
    this.setValue(value);
  }
  #updateState(value: UseState<T>, error: UseState<string>) {
    this.#value = value[0];
    this.#setValue = value[1];
    this.#error = error[0];
    this.#setError = error[1];
  }
}

type UseState<T> = ReturnType<typeof useState<T>>;
type UseStateSetter<T> = UseState<T>[1];
type ValidationCallback = (rule: ValidationRule) => any;
