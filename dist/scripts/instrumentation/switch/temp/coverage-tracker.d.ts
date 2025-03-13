export let branches: {};
export let switches: {};
export let cases: {};
export let functions: {};
export function trackFunctionStart(funcName: any, component: any, id: any): boolean;
export function trackSwitch(component: any, switchId: any, value: any): any;
export function trackCase(component: any, switchId: any, caseId: any, matches: any): any;
export function getReport(): {
    switches: {};
    cases: {};
};
export function printReport(): void;
