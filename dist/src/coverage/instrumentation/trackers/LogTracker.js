"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogTracker = void 0;
class LogTracker {
    static track(componentId) {
        this.logs.push({
            id: componentId,
            timestamp: Date.now(),
            context: this.getCurrentContext()
        });
    }
    static getCurrentContext() {
        return process.env.TEST_CONTEXT || 'runtime';
    }
}
exports.LogTracker = LogTracker;
LogTracker.logs = [];
