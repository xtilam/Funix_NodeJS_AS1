export const applyInput = () => {};

class ApplyInput {
  constructor(config) {
    this.config = config;
    this.applyPlugin();
  }
  applyPlugin() {
    // ----------------------------------------------
    const { plugins } = this.config;
    this.plugins.push(plugin);
  }
}
