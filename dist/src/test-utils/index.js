"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockFeatureFile = exports.createMockCoverageMap = void 0;
const createMockCoverageMap = (components) => {
    return components.reduce((acc, component) => {
        acc[`src/components/${component}.tsx`] = {
            statements: { covered: 80, total: 100 },
            branches: { covered: 70, total: 100 }
        };
        return acc;
    }, {});
};
exports.createMockCoverageMap = createMockCoverageMap;
const createMockFeatureFile = (name, tags) => ({
    path: `features/${name}.feature`,
    content: '',
    tags,
    scenarios: []
});
exports.createMockFeatureFile = createMockFeatureFile;
