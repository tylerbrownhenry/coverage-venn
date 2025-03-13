export let functions: {};
export let branches: {};
export let loops: {};
export function trackFunctionStart(functionName: any, component: any, id: any): boolean;
export function trackBranch(component: any, branchId: any, branchType: any, condition: any): any;
export function trackLoop(component: any, loopId: any, ...args: any[]): any;
export function printReport(): void;
