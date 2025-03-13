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
exports.TagManager = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
class TagManager {
    constructor(baseDir) {
        this.tags = new Map();
        this.tagStorePath = path.join(baseDir, '.tag-store.json');
    }
    async loadTags() {
        try {
            const data = await fs.readFile(this.tagStorePath, 'utf-8');
            this.tags = new Map(JSON.parse(data));
        }
        catch {
            this.tags = new Map();
        }
    }
    async saveTags() {
        const data = JSON.stringify(Array.from(this.tags.entries()), null, 2);
        await fs.writeFile(this.tagStorePath, data);
    }
    async registerTag(tag) {
        this.validateTag(tag);
        this.tags.set(tag.name, {
            ...tag,
            metadata: {
                ...tag.metadata,
                updatedAt: new Date().toISOString()
            }
        });
        await this.saveTags();
    }
    async updateRelationships(tagName, relationships) {
        const tag = this.tags.get(tagName);
        if (!tag)
            throw new Error(`Tag ${tagName} not found`);
        tag.relationships = relationships;
        tag.metadata.updatedAt = new Date().toISOString();
        await this.saveTags();
    }
    async getTagsByComponent(componentPath) {
        return Array.from(this.tags.values())
            .filter(tag => tag.components.includes(componentPath));
    }
    async getRelatedTags(tagName) {
        const tag = this.tags.get(tagName);
        if (!tag)
            return [];
        return Array.from(this.tags.values())
            .filter(t => tag.relationships.includes(t.name));
    }
    validateTag(tag) {
        if (!tag.name.startsWith('@')) {
            throw new Error('Tag name must start with @');
        }
        if (!/^@[a-z_]+/.test(tag.name)) {
            throw new Error('Tag name must use lowercase and underscores');
        }
        if (tag.components.length === 0) {
            throw new Error('Tag must be associated with at least one component');
        }
    }
}
exports.TagManager = TagManager;
