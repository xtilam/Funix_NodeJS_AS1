import { appColors } from "./colors";

export const applyOther = (config) => {
  new ApplyOther(config);
};

class ApplyOther {
  constructor(config) {
    this.config = config;
  }
  applyPlugin() {
    // const { plugins } = this.config;
    // plugins.push(({ addComponents }) => {
    //   const applyCss = (...css) => ({
    //     [`@apply ${css.filter((css) => css).join(" ")}`]: {},
    //   });
    //   // ----------------------------------------------
    //   addComponents({
    //     ".modal": applyCss("modal-css"),
    //     ".modal-backdrop": applyCss("modal-backdrop-css"),
    //   });
    //   Object.values(appColors).forEach(applyBtn);
    // });
  }
}
