export let name: string;
export namespace visitor {
    function FunctionDeclaration(path: any): void;
    function ArrowFunctionExpression(path: any): void;
    function IfStatement(path: any): void;
    function SwitchStatement(path: any): void;
    function TryStatement(path: any): void;
}
