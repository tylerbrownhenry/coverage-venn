
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

function simple() {
  COVERAGE_TRACKER.trackFunctionStart("simple", "simple", 0);
  try {
    try {
      return "success";
    } catch (error) {
      return "error";
    }
    COVERAGE_TRACKER.trackFunctionEnd("simple", "simple", 0);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("simple", "simple", 0);
    throw error;
  }
}
console.log(simple());
    