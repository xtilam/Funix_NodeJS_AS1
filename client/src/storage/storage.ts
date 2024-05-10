import { ModelData } from "../shared/@types/Models";
import { BaseStorageData } from "./BaseStorageData";

export const storage = {
  auth: new BaseStorageData<ModelData.UserToken>("auth", () => null),
};
