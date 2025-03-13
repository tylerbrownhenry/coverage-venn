"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserStackService = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class BrowserStackService {
    constructor(config) {
        this.config = config;
        this.baseUrl = 'https://api.browserstack.com/automate';
        this.auth = Buffer.from(`${config.username}:${config.accessKey}`).toString('base64');
    }
    async getSessions() {
        const response = await this.request('GET', '/builds.json');
        return response
            .filter((build) => build.project === this.config.projectName)
            .map((build) => ({
            id: build.id,
            name: build.name,
            status: build.status === 'passed' ? 'passed' : 'failed',
            browser: build.browser || build.automation_session?.browser || 'unknown',
            duration: build.duration || build.automation_session?.duration || 0,
            tags: build.automation_session?.tags || [],
            buildId: build.buildId || build.build_id || build.id
        }));
    }
    async updateSession(sessionId, data) {
        await this.request('PUT', `/sessions/${sessionId}.json`, data);
    }
    async addTags(sessionId, tags) {
        await this.updateSession(sessionId, { tags });
    }
    async request(method, path, body) {
        const response = await (0, node_fetch_1.default)(`${this.baseUrl}${path}`, {
            method,
            headers: {
                'Authorization': `Basic ${this.auth}`,
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });
        if (!response.ok) {
            throw new Error(`BrowserStack API error: ${response.statusText}`);
        }
        return response.json();
    }
}
exports.BrowserStackService = BrowserStackService;
