declare function fetchData(): Promise<{
    success: boolean;
    data: {
        id: number;
        name: string;
    };
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
declare function fetchData(...args: any[]): any;
/**
 * Test file for async function and promise instrumentation
 *
 * This file tests various patterns of async functions and promises
 * to ensure our instrumentation works correctly.
 */
declare function fetchData(): Promise<{
    success: boolean;
    data: {
        id: number;
        name: string;
    };
    error?: undefined;
} | {
    success: boolean;
    error: unknown;
    data?: undefined;
}>;
declare function fetchData(...args: any[]): any;
declare function saveData(data: any): Promise<any>;
declare function saveData(data: any): any;
declare function saveData(data: any): Promise<any>;
declare function saveData(data: any): any;
declare function complexOperation(condition: any): Promise<{
    success: boolean;
    stage: string;
    result?: undefined;
    error?: undefined;
} | {
    success: boolean;
    result: any;
    stage?: undefined;
    error?: undefined;
} | {
    success: boolean;
    stage: string;
    error: unknown;
    result?: undefined;
}>;
declare function complexOperation(_x2: any, ...args: any[]): any;
declare function complexOperation(condition: any): Promise<{
    success: boolean;
    stage: string;
    result?: undefined;
    error?: undefined;
} | {
    success: boolean;
    result: any;
    stage?: undefined;
    error?: undefined;
} | {
    success: boolean;
    stage: string;
    error: unknown;
    result?: undefined;
}>;
declare function complexOperation(_x2: any, ...args: any[]): any;
declare function batchProcess(items: any): Promise<any[]>;
declare function batchProcess(_x3: any, ...args: any[]): any;
declare function batchProcess(items: any): Promise<any[]>;
declare function batchProcess(_x3: any, ...args: any[]): any;
declare function chainedOperations(): any;
declare function chainedOperations(): any;
declare function chainedOperations(): any;
declare function chainedOperations(): any;
declare function processData(data: any): Promise<any>;
