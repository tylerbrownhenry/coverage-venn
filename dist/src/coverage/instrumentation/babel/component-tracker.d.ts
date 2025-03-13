import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
export declare function createComponentTracker(): {
    visitor: {
        FunctionDeclaration(path: NodePath<t.FunctionDeclaration>): void;
    };
};
