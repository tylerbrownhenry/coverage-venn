"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var config_exports = {};
__export(config_exports, {
  getConfig: () => getConfig
});
module.exports = __toCommonJS(config_exports);
var path = __toESM(require("path"));
function getConfig(name, options = {}) {
  const configPaths = [
    options.configPath,
    process.env[`${name.toUpperCase()}_CONFIG_PATH`],
    path.join(process.cwd(), `config/${name}.config.js`),
    path.join(process.cwd(), `.${name}rc.js`),
    path.join(process.cwd(), `.${name}rc.json`)
  ].filter((p) => Boolean(p));
  for (const configPath of configPaths) {
    try {
      console.log("Trying config path:", configPath);
      const resolvedPath = require.resolve(configPath);
      const config = require(resolvedPath);
      console.log("Loaded config from:", resolvedPath);
      return config;
    } catch (error) {
      console.log("Failed to load config from:", configPath);
      continue;
    }
  }
  if (options.required) {
    throw new Error(`Could not find config for ${name} in: ${configPaths.join(", ")}`);
  }
  return {};
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getConfig
});
//# sourceMappingURL=config.js.map
