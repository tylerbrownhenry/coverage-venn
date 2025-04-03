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
var ComponentHierarchyScanner_exports = {};
__export(ComponentHierarchyScanner_exports, {
  ComponentHierarchyScanner: () => ComponentHierarchyScanner
});
module.exports = __toCommonJS(ComponentHierarchyScanner_exports);
var import_parser = require("@babel/parser");
var import_traverse = __toESM(require("@babel/traverse"));
var t = __toESM(require("@babel/types"));
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));
var import_validators = require("../validators/index");
var import_config = require("../../core/config");
const DEFAULT_CONFIG = {
  includes: ["**/*.tsx", "**/*.ts"],
  excludes: ["**/*.test.*", "**/*.spec.*"],
  maxDepth: 3
};
class ComponentHierarchyScanner {
  constructor() {
    this.componentMap = /* @__PURE__ */ new Map();
    this.validator = new import_validators.TestIdValidator();
    try {
      const loadedConfig = (0, import_config.getConfig)("scanner", {
        required: false,
        configPath: process.env.SCANNER_CONFIG_PATH
      });
      this.config = {
        ...DEFAULT_CONFIG,
        ...loadedConfig
      };
    } catch (error) {
      console.warn("Failed to load scanner config, using defaults:", error);
      this.config = DEFAULT_CONFIG;
    }
    console.log("Scanner config:", this.config);
  }
  async scanDirectory(rootDir) {
    const files = await this.findComponentFiles(rootDir);
    console.log("files:", files);
    for (const file of files) {
      await this.analyzeComponent(file);
    }
    await this.buildRelationships();
    return this.componentMap;
  }
  async findComponentFiles(dir, depth = 0) {
    console.log("Scanning directory:", dir);
    if (this.config.maxDepth > 0 && depth >= this.config.maxDepth) {
      return [];
    }
    const files = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });
    console.log("Found entries:", entries.map((e) => ({ name: e.name, isDir: e.isDirectory() })));
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        console.log("Entering directory:", fullPath);
        files.push(...await this.findComponentFiles(fullPath, depth + 1));
      } else {
        console.log("Checking file:", fullPath);
        const isComponent = this.isComponentFile(entry.name);
        console.log("Is component file?", isComponent, entry.name);
        if (isComponent) {
          console.log("Adding component file:", fullPath);
          files.push(fullPath);
        }
      }
    }
    return files;
  }
  isComponentFile(filename) {
    const matchesInclude = this.config.includes.some((pattern) => {
      const globPattern = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\./g, "\\.");
      const regex = new RegExp(globPattern);
      const matches = regex.test(filename);
      console.log("Testing include pattern:", pattern, "against:", filename, "Result:", matches);
      return matches;
    });
    const matchesExclude = this.config.excludes.some((pattern) => {
      const globPattern = pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*").replace(/\./g, "\\.");
      const regex = new RegExp(globPattern);
      const matches = regex.test(filename);
      console.log("Testing exclude pattern:", pattern, "against:", filename, "Result:", matches);
      return matches;
    });
    return matchesInclude && !matchesExclude;
  }
  async analyzeComponent(filePath) {
    const content = await fs.readFile(filePath, "utf-8");
    const ast = (0, import_parser.parse)(content, {
      sourceType: "module",
      plugins: ["typescript", "jsx"]
    });
    const componentName = path.basename(filePath, path.extname(filePath)).replace(/^[a-z]/, (c) => c.toUpperCase());
    const componentNode = {
      name: componentName,
      path: filePath,
      children: [],
      parents: [],
      imports: [],
      testIds: []
    };
    (0, import_traverse.default)(ast, {
      ImportDeclaration: (path2) => {
        componentNode.imports.push(path2.node.source.value);
      },
      JSXIdentifier: (path2) => {
        if (this.isCustomComponent(path2.node.name)) {
          componentNode.children.push(path2.node.name);
        }
      },
      JSXAttribute: (path2) => {
        if (path2.node.name.name === "data-testid" && t.isStringLiteral(path2.node.value)) {
          const testId = path2.node.value.value;
          const validationResult = this.validator.validate(testId, componentNode);
          if (!validationResult.isValid) {
            validationResult.errors.forEach((error) => {
              console.error(`Invalid test ID "${testId}": ${error.message}`);
              console.error(`Suggestion: ${error.suggestion}`);
            });
          }
          componentNode.testIds.push(testId);
        }
      }
    });
    this.componentMap.set(componentNode.name, componentNode);
  }
  async buildRelationships() {
    for (const [name, component] of this.componentMap.entries()) {
      for (const childName of component.children) {
        const childComponent = this.componentMap.get(childName);
        if (childComponent) {
          childComponent.parents.push(name);
        }
      }
    }
  }
  isCustomComponent(name) {
    return /^[A-Z]/.test(name);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ComponentHierarchyScanner
});
//# sourceMappingURL=ComponentHierarchyScanner.js.map
