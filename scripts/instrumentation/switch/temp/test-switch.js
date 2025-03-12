
// Basic switch statement
function getColorName(colorCode) {
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
}

// Switch with fallthrough cases
function getDayType(day) {
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
