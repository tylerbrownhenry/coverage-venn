export let branches: {};
export let switches: {};
export let cases: {};
export let functions: {};
export let jsx: {};
export let tryBlocks: {};
export function trackBranch(component: any, branchId: any, type: any, condition: any): any;
export function trackSwitch(component: any, switchId: any, value: any): any;
export function trackCase(component: any, switchId: any, caseId: any, matches: any): any;
export function trackFunction(component: any, funcId: any, name: any): void;
export function trackJSX(component: any, jsxId: any, elementType: any): void;
export function trackTryEnter(component: any, tryId: any): boolean;
export function trackCatchEnter(component: any, tryId: any, error: any): boolean;
export function trackFinallyEnter(component: any, tryId: any): boolean;
export function getReport(): {
    branches: {};
    switches: {};
    cases: {};
    functions: {};
    jsx: {};
    tryBlocks: {};
};
export function printReport(): void;
