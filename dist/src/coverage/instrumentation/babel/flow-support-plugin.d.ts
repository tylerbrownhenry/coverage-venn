export let name: string;
export function pre(): void;
export namespace visitor {
    namespace Program {
        function enter(path: any, state: any): void;
        function exit(): void;
    }
    function InterfaceDeclaration(path: any): void;
    function TypeAlias(path: any): void;
    function DeclareClass(path: any): void;
    function DeclareFunction(path: any): void;
    function DeclareInterface(path: any): void;
    function DeclareModule(path: any): void;
    function DeclareTypeAlias(path: any): void;
    function DeclareVariable(path: any): void;
    function TypeCastExpression(path: any): void;
    function TypeParameterDeclaration(path: any): void;
    function ConditionalExpression(path: any, state: any): void;
    function IfStatement(path: any, state: any): void;
    function LogicalExpression(path: any, state: any): void;
    function FunctionDeclaration(path: any, state: any): void;
    function ArrowFunctionExpression(path: any, state: any): void;
    function VariableDeclarator(path: any, state: any): void;
    function ObjectProperty(path: any, state: any): void;
    function ClassMethod(path: any, state: any): void;
}
