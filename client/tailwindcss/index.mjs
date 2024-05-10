import { Config } from "tailwindcss";
import { applyColors } from "./colors";
import { applyButton } from "./button.mjs";

/**
 *
 * @param {Config} config
 */
export const applyTailwind = (config) => {
  try {
    applyColors(config);
    applyButton(config);
  } catch (error) {
    console.log(error);
  }
  return config;
};
