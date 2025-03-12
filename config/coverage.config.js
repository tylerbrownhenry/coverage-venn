module.exports = {
  tracking: {
    enabled: true,
    selective: true,
    components: ['root_*', 'shared_*'],
  },
  reporting: {
    format: 'html',
    correlations: true,
    visualizations: true
  },
  validation: {
    preCommit: true,
    rules: ['naming', 'organization', 'coverage']
  }
};
