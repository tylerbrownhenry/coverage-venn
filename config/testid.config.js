module.exports = {
  rules: {
    prefix: {
      enabled: true,
      severity: 'error'
    },
    case: {
      enabled: true,
      severity: 'error'
    },
    hierarchy: {
      enabled: true,
      severity: 'error'
    }
  },
  patterns: {
    component: '^[a-z]+(_[a-z]+)*$',
    variant: '^[a-z]+(_[a-z]+)*$'
  },
  prefixes: {
    root: 'root',
    shared: 'shared'
  }
};
