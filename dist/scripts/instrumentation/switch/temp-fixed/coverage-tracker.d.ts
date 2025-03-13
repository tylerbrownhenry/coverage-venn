export let functions: {};
export let branches: {};
export let switches: {};
export function trackFunctionStart(functionName: any, component: any, id: any): boolean;
export function trackBranch(component: any, branchId: any, branchType: any, condition: any): any;
export function trackSwitch(component: any, switchId: any, discriminant: any, caseIndex: any): any;
export function printReport(): void;
