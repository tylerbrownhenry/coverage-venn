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
exports.TestMetadataService = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class TestMetadataService {
    constructor(baseDir) {
        this.metadata = new Map();
        this.metadataPath = path.join(baseDir, '.test-metadata.json');
    }
    async loadMetadata() {
        try {
            const data = await fs.readFile(this.metadataPath, 'utf-8');
            this.metadata = new Map(JSON.parse(data));
        }
        catch {
            this.metadata = new Map();
        }
    }
    async saveMetadata() {
        const data = JSON.stringify(Array.from(this.metadata.entries()), null, 2);
        await fs.writeFile(this.metadataPath, data);
    }
    async updateTestMetadata(id, metadata) {
        const defaultMetadata = {
            id,
            name: id,
            components: [],
            tags: []
        };
        const existing = this.metadata.get(id) || defaultMetadata;
        const updated = {
            ...existing,
            ...metadata,
            // Ensure required properties are always defined
            id: metadata.id || existing.id,
            name: metadata.name || existing.name,
            components: metadata.components || existing.components,
            tags: metadata.tags || existing.tags
        };
        this.metadata.set(id, updated);
        await this.saveMetadata();
    }
    async getTestMetadata(id) {
        return this.metadata.get(id);
    }
}
exports.TestMetadataService = TestMetadataService;
