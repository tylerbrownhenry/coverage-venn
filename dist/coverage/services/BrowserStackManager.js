"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var BrowserStackManager_exports = {};
__export(BrowserStackManager_exports, {
  BrowserStackManager: () => BrowserStackManager
});
module.exports = __toCommonJS(BrowserStackManager_exports);
var import_config = require("../../core/config");
class BrowserStackManager {
  constructor(config) {
    const defaultConfig = (0, import_config.getConfig)("browserStack", {
      required: false,
      configPath: process.env.BROWSERSTACK_CONFIG_PATH
    });
    this.config = {
      enabled: false,
      ...defaultConfig,
      ...config
    };
  }
  async initialize() {
    if (!this.config.enabled) {
      console.log("BrowserStack integration is disabled");
      return;
    }
    if (!this.config.username || !this.config.accessKey) {
      throw new Error("BrowserStack credentials not configured");
    }
    console.log("BrowserStack integration initialized");
  }
  async startSession(capabilities) {
    if (!this.config.enabled) {
      throw new Error("BrowserStack integration is not enabled");
    }
    return "session-id";
  }
  async endSession(sessionId) {
    if (!this.config.enabled) return;
    console.log(`Ended BrowserStack session: ${sessionId}`);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BrowserStackManager
});
//# sourceMappingURL=BrowserStackManager.js.map
