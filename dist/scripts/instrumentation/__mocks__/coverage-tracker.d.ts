export = CoverageTracker;
declare class CoverageTracker {
    coverageData: {
        branches: {};
        functions: {};
        statements: {};
        jsxElements: {};
    };
    trackBranch(id: any, condition: any): any;
    trackFunction(id: any, name: any, result: any): any;
    trackFunctionStart(id: any, name: any): any;
    trackFunctionEnd(id: any, result: any): any;
    trackStatement(id: any): void;
    trackJSXRender(component: any, id: any, elementType: any): void;
    getCoverageData(): {
        branches: {};
        functions: {};
        statements: {};
        jsxElements: {};
    };
    generateReport(): {
        coverage: {
            branches: {};
            functions: {};
            statements: {};
            jsxElements: {};
        };
        summary: {
            branches: {
                total: number;
                covered: number;
            };
            functions: {
                total: number;
                covered: number;
            };
            statements: {
                total: number;
                covered: number;
            };
        };
    };
}
