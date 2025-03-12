
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');

// Basic switch statement
function getColorName(colorCode) {
  COVERAGE_TRACKER.trackFunctionStart("getColorName", "getColorName", 0);
  try {
    let colorName;
    switch (colorCode) {
      case 1:
        colorName = 'Red';
        break;
      case 2:
        colorName = 'Green';
        break;
      case 3:
        colorName = 'Blue';
        break;
      default:
        colorName = 'Unknown';
    }
    return colorName;
    COVERAGE_TRACKER.trackFunctionEnd("getColorName", "getColorName", 0);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("getColorName", "getColorName", 0);
    throw error;
  }
}

// Switch with fallthrough cases
function getDayType(day) {
  COVERAGE_TRACKER.trackFunctionStart("getDayType", "getDayType", 1);
  try {
    let type;
    switch (day.toLowerCase()) {
      case 'monday':
      case 'tuesday':
      case 'wednesday':
      case 'thursday':
      case 'friday':
        type = 'Weekday';
        break;
      case 'saturday':
      case 'sunday':
        type = 'Weekend';
        break;
      default:
        type = 'Invalid day';
    }
    return type;
    COVERAGE_TRACKER.trackFunctionEnd("getDayType", "getDayType", 1);
  } catch (error) {
    COVERAGE_TRACKER.trackFunctionError("getDayType", "getDayType", 1);
    throw error;
  }
}

// Test calls
console.log('Testing switch statements:');
console.log('Color 1:', getColorName(1));
console.log('Color 3:', getColorName(3));
console.log('Color 5:', getColorName(5));
console.log('Monday is a', getDayType('Monday'));
console.log('Saturday is a', getDayType('Saturday'));
console.log('Invalid is', getDayType('Invalid'));

// Get coverage report
const coverageTracker = require('./coverage-tracker');
coverageTracker.printReport();
    