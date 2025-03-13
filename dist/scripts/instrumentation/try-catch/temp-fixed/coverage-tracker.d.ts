export let functions: {};
export let branches: {};
export let tryCatch: {};
export function trackFunctionStart(functionName: any, component: any, id: any): boolean;
export function trackFunctionEnd(functionName: any, component: any, id: any): boolean;
export function trackFunctionError(functionName: any, component: any, id: any): boolean;
export function trackBranch(component: any, branchId: any, branchType: any, condition: any): any;
export function trackTryCatch(component: any, id: any, block: any, error: any): void;
export function getReport(): {
    functions: {};
    branches: {};
    tryCatch: {};
};
export function printReport(): void;
