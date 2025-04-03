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
var TestIdGenerator_exports = {};
__export(TestIdGenerator_exports, {
  TestIdGenerator: () => TestIdGenerator
});
module.exports = __toCommonJS(TestIdGenerator_exports);
var t = __toESM(require("@babel/types"));
var import_traverse = __toESM(require("@babel/traverse"));
var import_TestIdValidator = require("./TestIdValidator");
class TestIdGenerator {
  constructor() {
    this.validator = new import_TestIdValidator.TestIdValidator();
  }
  /**
   * Generate recommended testIDs for a component
   * @param component The component to analyze
   * @param ast The AST of the component
   */
  generateRecommendations(component, ast) {
    const recommendations = [];
    this.traverseJsxElements(ast, (path, elementInfo) => {
      if (this.hasTestId(path)) {
        return;
      }
      const testId = this.generateTestIdForElement(component, elementInfo);
      recommendations.push({
        elementId: elementInfo.type + (elementInfo.variant ? `-${elementInfo.variant}` : ""),
        elementType: elementInfo,
        elementPath: this.getElementPath(path),
        recommendedTestId: testId,
        confidence: this.calculateConfidence(elementInfo),
        reason: this.generateReason(elementInfo)
      });
    });
    return recommendations;
  }
  /**
   * Check if an element already has a testID
   */
  hasTestId(path) {
    const attributes = path.node.openingElement.attributes;
    return attributes.some(
      (attr) => t.isJSXAttribute(attr) && (t.isJSXIdentifier(attr.name) && (attr.name.name === "data-testid" || attr.name.name === "testID"))
    );
  }
  /**
   * Traverse all JSX elements in an AST
   */
  traverseJsxElements(ast, callback) {
    const self = this;
    (0, import_traverse.default)(ast, {
      JSXElement(path) {
        const elementName = self.getElementName(path);
        const elementInfo = self.analyzeElement(path);
        callback(path, elementInfo);
      }
    });
  }
  /**
   * Get the name of a JSX element
   */
  getElementName(path) {
    const openingElement = path.node.openingElement;
    if (t.isJSXIdentifier(openingElement.name)) {
      return openingElement.name.name;
    } else if (t.isJSXMemberExpression(openingElement.name)) {
      let result = "";
      let current = openingElement.name;
      while (t.isJSXMemberExpression(current)) {
        if (t.isJSXIdentifier(current.property)) {
          result = current.property.name + (result ? "." + result : "");
        }
        current = current.object;
      }
      if (t.isJSXIdentifier(current)) {
        result = current.name + (result ? "." + result : "");
      }
      return result;
    }
    return "unknown";
  }
  /**
   * Analyze a JSX element to determine its type and properties
   */
  analyzeElement(path) {
    const elementName = this.getElementName(path);
    const attributes = path.node.openingElement.attributes;
    const elementType = {
      type: elementName.toLowerCase()
    };
    const roleAttr = attributes.find(
      (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && attr.name.name === "role"
    );
    if (roleAttr && t.isJSXAttribute(roleAttr) && roleAttr.value) {
      if (t.isStringLiteral(roleAttr.value)) {
        elementType.role = roleAttr.value.value;
      }
    }
    const variantAttr = attributes.find(
      (attr) => t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name) && (attr.name.name === "variant" || attr.name.name === "type")
    );
    if (variantAttr && t.isJSXAttribute(variantAttr) && variantAttr.value) {
      if (t.isStringLiteral(variantAttr.value)) {
        elementType.variant = variantAttr.value.value;
      }
    }
    return elementType;
  }
  /**
   * Generate a testID for an element based on component and element type
   */
  generateTestIdForElement(component, elementInfo) {
    const componentName = component.name.toLowerCase();
    const elementType = elementInfo.type.toLowerCase();
    const variant = elementInfo.variant ? elementInfo.variant.toLowerCase() : "";
    const role = elementInfo.role ? elementInfo.role.toLowerCase() : "";
    const isShared = component.path.includes("shared");
    const prefix = isShared ? "shared" : "root";
    let testId = `${prefix}_${componentName}`;
    if (elementType !== "div" && elementType !== "component") {
      testId += `_${elementType}`;
    }
    if (variant) {
      testId += `_${variant}`;
    }
    if (role) {
      testId += `_${role}`;
    }
    return testId;
  }
  /**
   * Calculate confidence score for a recommendation
   */
  calculateConfidence(elementInfo) {
    let confidence = 0.7;
    if (this.isInteractiveElement(elementInfo)) {
      confidence += 0.2;
    }
    if (elementInfo.role) {
      confidence += 0.1;
    }
    return Math.min(confidence, 1);
  }
  /**
   * Check if an element is interactive
   */
  isInteractiveElement(elementInfo) {
    const interactiveTypes = ["button", "input", "a", "select", "textarea", "option"];
    const interactiveRoles = ["button", "link", "checkbox", "radio", "tab", "menuitem"];
    const typeMatch = interactiveTypes.includes(elementInfo.type.toLowerCase());
    const roleMatch = elementInfo.role ? interactiveRoles.includes(elementInfo.role.toLowerCase()) : false;
    return typeMatch || roleMatch;
  }
  /**
   * Generate a reason for the recommendation
   */
  generateReason(elementInfo) {
    if (this.isInteractiveElement(elementInfo)) {
      return `Interactive ${elementInfo.type} elements should have testIDs for testing user interactions`;
    }
    if (elementInfo.role) {
      return `Elements with role '${elementInfo.role}' should have testIDs for accessibility testing`;
    }
    return `Adding testID improves component testability`;
  }
  /**
   * Get a string representation of the element's path in the component
   */
  getElementPath(path) {
    const elements = [];
    let current = path;
    while (current) {
      if (current.isJSXElement()) {
        const element = current.node;
        const openingElement = element.openingElement;
        if (t.isJSXIdentifier(openingElement.name)) {
          elements.unshift(openingElement.name.name);
        }
      }
      current = current.parentPath;
      if (current && (current.isFunction() || current.isVariableDeclaration())) {
        break;
      }
    }
    return elements.join(" > ") || "component";
  }
  /**
   * Detect interactive elements in a component
   */
  detectInteractiveElements(ast) {
    const interactiveElements = [];
    const self = this;
    (0, import_traverse.default)(ast, {
      JSXElement: (path) => {
        const elementInfo = self.analyzeElement(path);
        if (self.isInteractiveElement(elementInfo) && !self.hasTestId(path)) {
          interactiveElements.push(elementInfo);
        }
      }
    });
    return interactiveElements;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TestIdGenerator
});
//# sourceMappingURL=TestIdGenerator.js.map
