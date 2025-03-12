import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export function createComponentTracker() {
  return {
    visitor: {
      FunctionDeclaration(path: NodePath<t.FunctionDeclaration>) {
        if (isReactComponent(path)) {
          injectTrackingCode(path);
        }
      }
    }
  };
}
