/**
 * Babel plugin for advanced code coverage instrumentation
 *
 * This plugin adds instrumentation to track:
 * - Conditional branches (if/else, ternary)
 * - JSX conditional rendering
 * - Function execution and completion
 * - React component rendering
 */
declare module '@babel/helper-plugin-utils' {
    function declare<T>(callback: (api: any) => T): T;
}
import { types as t, NodePath } from '@babel/core';
type BabelState = {
    filename: string;
    opts: Record<string, any>;
    file: {
        path: NodePath;
        opts: Record<string, any>;
    };
};
/**
 * The main Babel plugin
 */
declare const _default: {
    name: string;
    visitor: {
        IfStatement(path: NodePath<t.IfStatement>, state: BabelState): void;
        ConditionalExpression(path: NodePath<t.ConditionalExpression>, state: BabelState): void;
        LogicalExpression(path: NodePath<t.LogicalExpression>, state: BabelState): void;
        JSXElement(path: NodePath<t.JSXElement>, state: BabelState): void;
        FunctionDeclaration(path: NodePath<t.FunctionDeclaration>, state: BabelState): void;
        ArrowFunctionExpression(path: NodePath<t.ArrowFunctionExpression>, state: BabelState): void;
        TSInterfaceDeclaration(): void;
        TSTypeAliasDeclaration(): void;
        TSEnumDeclaration(): void;
        TSDeclareFunction(): void;
        TSAsExpression(path: NodePath<t.TSAsExpression>, state: BabelState): void;
        TSTypeParameter(): void;
    };
};
export default _default;
