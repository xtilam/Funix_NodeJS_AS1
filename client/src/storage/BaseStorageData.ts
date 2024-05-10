export class BaseStorageData<T> {
  private _property = "";
  private _defaultValue: () => any;

  constructor(property: string, getDefaultValue?: () => T) {
    this._property = property;
    this._defaultValue =
      typeof getDefaultValue === "function" ? getDefaultValue : () => null;
  }
  read(): T {
    try {
      const storageData = localStorage.getItem(this._property);
      if (!storageData) return this._defaultValue();
      return JSON.parse(storageData);
    } catch (error) {
      return this._defaultValue();
    }
  }
  update(callback: (data: T) => any) {
    const data = this.read();
    const newData = callback(data);
    return this.write(newData || data);
  }
  updateObject(callback: (data: T) => any) {
    const data = this.read();
    callback(data);
    return this.write(data);
  }
  write(data: T) {
    try {
      localStorage.setItem(this._property, JSON.stringify(data));
      return true;
    } catch (error) {
      return false;
    }
  }
  clear() {
    localStorage.removeItem(this._property);
  }
}
