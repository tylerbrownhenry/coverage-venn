"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectConfigs = void 0;
exports.getProjectConfig = getProjectConfig;
exports.projectConfigs = {
    "jogger": {
        "excludeTestPatterns": [
            "__mocks__/**",
            "**/*.mock.*",
            "**/mock-*/**",
            "**/App.test.tsx",
            "__mocks__/src/__tests__/App.test.tsx"
        ],
        "customMappings": {
            "src/contexts/MachineContext.tsx": []
        },
        "confidenceThreshold": 0.7
    },
    "default": {
        "excludeTestPatterns": [],
        "customMappings": {},
        "confidenceThreshold": 0.6
    },
    "testApp": {
        "excludeTestPatterns": [],
        "customMappings": {
            "src/components/Counter.tsx": [
                "src/__tests__/Counter.test.tsx"
            ],
            "src/App.tsx": [
                "src/__tests__/Counter.test.tsx"
            ]
        },
        "confidenceThreshold": 0.6
    }
};
function getProjectConfig(projectName) {
    return exports.projectConfigs[projectName] || exports.projectConfigs.default;
}
