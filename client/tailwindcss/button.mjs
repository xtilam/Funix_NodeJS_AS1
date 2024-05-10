import { appColors } from "./colors";

export const applyButton = (config) => {
  new ApplyButton(config);
};

class ApplyButton {
  constructor(config) {
    this.config = config;
    this.applySafeList();
    this.applyPlugin();
  }
  applySafeList() {}
  applyPlugin() {
    const { plugins } = this.config;
    plugins.push(({ addComponents }) => {
      const applyCss = (...css) => ({
        [`@apply ${css.filter((css) => css).join(" ")}`]: {},
      });
      const applyBtn = (color) => {
        const colorDarker = color + "-darker";
        const colorLighter = color + "-lighter";
        addComponents({
          [`.btn-${color}`]: applyCss(
            `text-white btn bg-${color}`,
            `hover:bg-${colorDarker} btn-disabled`
          ),
          [`.btn-outline-${color}`]: {
            ...applyCss(
              `btn text-${color} bg-white shadow-${color}`,
              `hover:text-white hover:bg-${color} hover:shadow-none btn-disabled`
            ),
            boxShadow: "inset 0 0 0 2px",
          },
        });
      };
      // ----------------------------------------------
      addComponents({
        ".btn": applyCss(
          "font-medium px-4 py-1 uppercase duration-75 block text-center hover:scale-[1.08]"
        ),
        ".btn-disabled": applyCss(
          "disabled:text-white disabled:!bg-gray-400 disabled:!shadow-none"
        ),
      });
      Object.values(appColors).forEach(applyBtn);
    });
  }
}
