"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const react_1 = __importDefault(require("react"));
const utils_1 = require("../utils/utils");
const Button = () => {
    const buttonText = (0, utils_1.getThis)('Button Text');
    return (react_1.default.createElement("button", { "data-testid": "root_button" }, buttonText));
};
exports.Button = Button;
