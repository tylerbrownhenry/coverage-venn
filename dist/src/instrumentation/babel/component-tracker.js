"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createComponentTracker = createComponentTracker;
function createComponentTracker() {
    return {
        visitor: {
            FunctionDeclaration(path) {
                if (isReactComponent(path)) {
                    injectTrackingCode(path);
                }
            }
        }
    };
}
