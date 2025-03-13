export let branches: {};
export let switches: {};
export let cases: {};
export let functions: {};
export let jsx: {};
export function trackBranch(component: any, branchId: any, type: any, condition: any): any;
export function trackSwitch(component: any, switchId: any, value: any): any;
export function trackCase(component: any, switchId: any, caseId: any, isMatch: any): any;
export function trackFunctionStart(component: any, functionId: any, name: any): any;
export function trackFunctionEnd(component: any, functionId: any): any;
export function trackFunctionError(component: any, functionId: any, error: any): never;
export function trackJSX(component: any, jsxId: any, elementType: any): void;
export function getSummary(): {
    branches: any;
    switches: any;
    cases: any;
    functions: any;
    jsx: any;
};
export function getResults(): {
    branches: {};
    switches: {};
    cases: {};
    functions: {};
    jsx: {};
};
