export let functions: {};
export let branches: {};
export let classs: {};
export function trackFunctionStart(functionName: any, component: any, id: any): boolean;
export function trackBranch(component: any, branchId: any, branchType: any, condition: any): any;
export function trackClass(component: any, classId: any, ...args: any[]): any;
export function printReport(): void;
