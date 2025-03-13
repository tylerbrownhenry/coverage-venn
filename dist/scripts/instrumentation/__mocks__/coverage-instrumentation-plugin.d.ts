declare function _exports(): {
    name: string;
    visitor: {
        IfStatement(): void;
        FunctionDeclaration(): void;
        ArrowFunctionExpression(): void;
        JSXElement(): void;
        TryStatement(): void;
        SwitchStatement(): void;
    };
};
export = _exports;
