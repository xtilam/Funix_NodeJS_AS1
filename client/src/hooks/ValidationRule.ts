import BaseValidationRules from "./BaseValidationRule";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g;

export default class extends BaseValidationRules {
  phone(errorMessage = "Phone invalid"): any {
    return this.regexValidate(phoneRegex, errorMessage, this.stringValue());
  }
  email(errorMessage = "Email invalid") {
    return this.regexValidate(emailRegex, errorMessage);
  }
  min(length: number, errorMessage = "") {
    if (this.stringValue().length < length)
      return this.setError(errorMessage || `Minimum ${length} characters`);
    return this;
  }
  confirm(value, errorMessage: string) {
    if (this.value !== value) {
      return this.setError(errorMessage);
    }
    return this;
  }
  notEmpty(errorMessage: string = "This field is required") {
    if (this.stringValue().trim().length === 0)
      return this.setError(errorMessage);
    return this;
  }
  notEmptyNoTrim(errorMessage: string = "This field is required") {
    if (this.stringValue().length === 0) return this.setError(errorMessage);
    return this;
  }
  max(length: number, errorMessage = "") {
    if (this.stringValue().length > length)
      return this.setError(errorMessage || `Maximum ${length} characters`);
    return this;
  }
  positiveNumber(errorMessage = "") {
    const num = this.numberValue();
    if (isFinite(num) && num >= 0) return this;
    return this.setError(errorMessage || `The value must be a positive number`);
  }
  numberRange(min: number, max: number, errorMessage = "") {
    const num = this.numberValue();
    if (min <= num && num <= max) return this;
    return this.setError(
      errorMessage || `The value must be between ${min} and ${max}`
    );
  }
}
