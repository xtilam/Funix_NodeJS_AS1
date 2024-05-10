const colors = require("tailwindcss/colors");

const appColorsConfig = () => {
  const { cyan, red, yellow, orange, slate, blue, teal } = colors;
  const pickColor = (color, color1, color2, color3) => [
    color[color1],
    color[color2 || (color2 = color1 + 100)],
    color[color3 || (color3 = color2 + 100)],
  ];
  return {
    primary: pickColor(cyan, 500),
    danger: pickColor(red, 500),
    info: pickColor(blue, 500),
    warning: pickColor(yellow, 500),
    secondary: pickColor(slate, 600),
    success: pickColor(teal, 600),
  };
};

const tranformColor = (name, lighter, color, darker) => {
  return {
    [name]: color,
    [`${name}-lighter`]: lighter,
    [`${name}-darker`]: darker,
  };
};

export const appColors = Object.keys(appColorsConfig());

/**
 * @param {import('tailwindcss').Config} config
 */
export const applyColors = (config) => {
  const extendColors = config.theme.extend.colors;
  const colorsDefine = appColorsConfig();
  for (const color in colorsDefine) {
    Object.assign(extendColors, tranformColor(color, ...colorsDefine[color]));
  }
};
