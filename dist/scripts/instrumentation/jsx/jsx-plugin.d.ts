export let name: string;
export namespace visitor {
    function IfStatement(path: any, state: any): void;
    function ConditionalExpression(path: any, state: any): void;
    function LogicalExpression(path: any, state: any): void;
    function JSXElement(path: any, state: any): void;
    function FunctionDeclaration(path: any, state: any): void;
    function ArrowFunctionExpression(path: any, state: any): void;
    function TSInterfaceDeclaration(): void;
    function TSTypeAliasDeclaration(): void;
    function TSEnumDeclaration(): void;
    function TSDeclareFunction(): void;
    function TSAsExpression(path: any, state: any): void;
    function TSTypeParameter(): void;
}
