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
var TagManager_exports = {};
__export(TagManager_exports, {
  TagManager: () => TagManager
});
module.exports = __toCommonJS(TagManager_exports);
class TagManager {
  constructor(tagStorePath) {
    this.tagStorePath = tagStorePath;
    this.tags = /* @__PURE__ */ new Map();
  }
  async loadTags() {
    try {
      console.log("Loading tags from:", this.tagStorePath);
    } catch (error) {
      console.error("Failed to load tags:", error);
      this.tags = /* @__PURE__ */ new Map();
    }
  }
  async registerTag(tag) {
    this.tags.set(tag.name, tag);
    await this.saveTags();
  }
  async saveTags() {
    try {
      console.log("Saving tags to:", this.tagStorePath);
    } catch (error) {
      console.error("Failed to save tags:", error);
    }
  }
  getTag(name) {
    return this.tags.get(name);
  }
  getAllTags() {
    return Array.from(this.tags.values());
  }
  getTagsByComponent(componentPath) {
    return Array.from(this.tags.values()).filter((tag) => tag.components.includes(componentPath));
  }
  async updateRelationships(tagName, relationships) {
    const tag = this.tags.get(tagName);
    if (!tag) throw new Error(`Tag ${tagName} not found`);
    tag.relationships = relationships;
    tag.metadata.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    await this.saveTags();
  }
  getRelatedTags(tagName) {
    const tag = this.tags.get(tagName);
    if (!tag) return [];
    return Array.from(this.tags.values()).filter((t) => tag.relationships.includes(t.name));
  }
  validateTag(tag) {
    if (!tag.name.startsWith("@")) {
      throw new Error("Tag name must start with @");
    }
    if (!/^@[a-z_]+/.test(tag.name)) {
      throw new Error("Tag name must use lowercase and underscores");
    }
    if (tag.components.length === 0) {
      throw new Error("Tag must be associated with at least one component");
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TagManager
});
//# sourceMappingURL=TagManager.js.map
