"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
const path = __importStar(require("path"));
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
            console.log('Trying config path:', configPath);
            const resolvedPath = require.resolve(configPath);
            const config = require(resolvedPath);
            console.log('Loaded config from:', resolvedPath);
            return config;
        }
        catch (error) {
            console.log('Failed to load config from:', configPath);
            continue;
        }
    }
    if (options.required) {
        throw new Error(`Could not find config for ${name} in: ${configPaths.join(', ')}`);
    }
    return {};
}
