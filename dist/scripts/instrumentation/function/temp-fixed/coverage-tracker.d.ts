export let functions: {};
export let branches: {};
export function trackFunctionStart(functionName: any, component: any, id: any): boolean;
export function trackFunctionEnd(functionName: any, component: any, id: any): boolean;
export function trackFunctionError(functionName: any, component: any, id: any): boolean;
export function trackBranch(component: any, branchId: any, branchType: any, condition: any): any;
export function getReport(): {
    functions: {};
    branches: {};
};
export function printReport(): void;
