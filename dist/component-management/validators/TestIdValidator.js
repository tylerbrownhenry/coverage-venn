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
var TestIdValidator_exports = {};
__export(TestIdValidator_exports, {
  TestIdValidator: () => TestIdValidator
});
module.exports = __toCommonJS(TestIdValidator_exports);
class TestIdValidator {
  constructor() {
    this.rules = [
      {
        name: "prefix",
        pattern: /^(root|shared)_/,
        message: 'Test ID must start with "root_" or "shared_"',
        severity: "error",
        validate: (testId) => /^(root|shared)_/.test(testId)
      },
      {
        name: "case",
        pattern: /^[a-z]+(_[a-z]+)*$/,
        message: "Test ID must be lowercase with underscore separators",
        severity: "error",
        validate: (testId) => /^[a-z]+(_[a-z]+)*$/.test(testId)
      },
      {
        name: "hierarchy",
        pattern: /^.*$/,
        message: "Test ID must reflect component hierarchy",
        severity: "error",
        validate: (testId, component) => {
          const expectedPrefix = this.generateExpectedPrefix(component);
          return testId.startsWith(expectedPrefix);
        }
      }
    ];
  }
  validate(testId, component) {
    const errors = [];
    const warnings = [];
    this.rules.forEach((rule) => {
      if (!rule.validate(testId, component)) {
        const error = {
          rule: rule.name,
          message: rule.message,
          testId,
          component: component.name,
          suggestion: this.generateSuggestion(rule, component)
        };
        if (rule.severity === "error") {
          errors.push(error);
        } else {
          warnings.push(error);
        }
      }
    });
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  generateExpectedPrefix(component) {
    const pathSegments = component.path.split("/").filter((segment) => segment.length > 0);
    const isShared = pathSegments.includes("shared");
    const prefix = isShared ? "shared" : "root";
    return `${prefix}_${component.name.toLowerCase()}`;
  }
  generateSuggestion(rule, component) {
    switch (rule.name) {
      case "prefix":
        return this.generateExpectedPrefix(component);
      case "case":
        return component.name.toLowerCase();
      case "hierarchy":
        return this.generateExpectedPrefix(component);
      default:
        return "";
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TestIdValidator
});
//# sourceMappingURL=TestIdValidator.js.map
