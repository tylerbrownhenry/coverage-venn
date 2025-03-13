export let name: string;
export namespace visitor {
    function TSInterfaceDeclaration(path: any): void;
    function TSTypeAliasDeclaration(path: any): void;
    function TSEnumDeclaration(path: any): void;
    function TSDeclareFunction(path: any): void;
    function TSAsExpression(path: any): void;
    function TSTypeParameter(): void;
    function TSParameterProperty(): void;
    function ConditionalExpression(path: any): void;
    function IfStatement(path: any): void;
    function LogicalExpression(path: any): void;
    function FunctionDeclaration(path: any): void;
    function ArrowFunctionExpression(path: any): void;
    function VariableDeclarator(path: any): void;
}
