export interface ComponentMoveTemplate {
  component: string;
  oldPath: string;
  newPath: string;
  dependencies: string[];
  tests: string[];
}

export const templateGenerator = {
  generateMigrationPlan(move: ComponentMoveTemplate): string {
    return `# Migration Plan for ${move.component}\n...`;
  }
};
