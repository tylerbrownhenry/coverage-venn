export let name: string;
export let visitor: {
    "FunctionDeclaration|FunctionExpression|ArrowFunctionExpression": (path: any) => void;
    IfStatement(path: any): void;
};
