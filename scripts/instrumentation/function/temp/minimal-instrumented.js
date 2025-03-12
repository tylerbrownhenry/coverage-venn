function add(a, b) {
  COVERAGE_TRACKER.trackFunctionStart("add", "add", 455);
  try {
    return a + b;
    COVERAGE_TRACKER.trackFunctionEnd("add", "add", 455);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("add", "add", 455);
    throw error;
  }
}
console.log(add(1, 2));