export let name: string;
export namespace visitor {
    function FunctionDeclaration(path: any, state: any): void;
    function ArrowFunctionExpression(path: any, state: any): void;
    function AwaitExpression(path: any, state: any): void;
    function NewExpression(path: any, state: any): void;
    function CallExpression(path: any, state: any): void;
}
