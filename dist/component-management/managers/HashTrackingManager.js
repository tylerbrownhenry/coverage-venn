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
var HashTrackingManager_exports = {};
__export(HashTrackingManager_exports, {
  HashTrackingManager: () => HashTrackingManager
});
module.exports = __toCommonJS(HashTrackingManager_exports);
var import_FileHasher = require("../../shared/utils/FileHasher");
var fs = __toESM(require("fs/promises"));
class HashTrackingManager {
  constructor(storePath = ".hash-store.json") {
    this.hashStore = /* @__PURE__ */ new Map();
    this.storePath = storePath;
  }
  async trackFile(filePath, relatedComponents = []) {
    const hash = await import_FileHasher.FileHasher.hashFile(filePath);
    const fileHash = {
      path: filePath,
      hash,
      lastUpdated: /* @__PURE__ */ new Date(),
      relatedComponents
    };
    this.hashStore.set(filePath, fileHash);
    await this.persistStore();
    return fileHash;
  }
  async hasFileChanged(filePath) {
    const currentHash = await import_FileHasher.FileHasher.hashFile(filePath);
    const storedHash = this.hashStore.get(filePath);
    return !storedHash || storedHash.hash !== currentHash;
  }
  async getChangedFiles() {
    const changedFiles = [];
    for (const [filePath, stored] of this.hashStore) {
      if (await this.hasFileChanged(filePath)) {
        changedFiles.push(stored);
      }
    }
    return changedFiles;
  }
  async persistStore() {
    const storeData = JSON.stringify(Array.from(this.hashStore.entries()), null, 2);
    await fs.writeFile(this.storePath, storeData);
  }
  async loadStore() {
    try {
      const data = await fs.readFile(this.storePath, "utf-8");
      this.hashStore = new Map(JSON.parse(data));
    } catch (error) {
      this.hashStore = /* @__PURE__ */ new Map();
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HashTrackingManager
});
//# sourceMappingURL=HashTrackingManager.js.map
