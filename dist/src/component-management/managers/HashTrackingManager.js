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
exports.HashTrackingManager = void 0;
const FileHasher_1 = require("../../shared/utils/FileHasher");
const fs = __importStar(require("fs/promises"));
class HashTrackingManager {
    constructor(storePath = '.hash-store.json') {
        this.hashStore = new Map();
        this.storePath = storePath;
    }
    async trackFile(filePath, relatedComponents = []) {
        const hash = await FileHasher_1.FileHasher.hashFile(filePath);
        const fileHash = {
            path: filePath,
            hash,
            lastUpdated: new Date(),
            relatedComponents
        };
        this.hashStore.set(filePath, fileHash);
        await this.persistStore();
        return fileHash;
    }
    async hasFileChanged(filePath) {
        const currentHash = await FileHasher_1.FileHasher.hashFile(filePath);
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
            const data = await fs.readFile(this.storePath, 'utf-8');
            this.hashStore = new Map(JSON.parse(data));
        }
        catch (error) {
            this.hashStore = new Map();
        }
    }
}
exports.HashTrackingManager = HashTrackingManager;
