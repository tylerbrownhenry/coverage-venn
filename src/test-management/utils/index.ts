export const createMockCoverageMap = (components: string[]) => {
  return components.reduce((acc, component) => {
    acc[`src/components/${component}.tsx`] = {
      statements: { covered: 80, total: 100 },
      branches: { covered: 70, total: 100 }
    };
    return acc;
  }, {});
};

export const createMockFeatureFile = (name: string, tags: string[]) => ({
  path: `features/${name}.feature`,
  content: '',
  tags,
  scenarios: []
});
