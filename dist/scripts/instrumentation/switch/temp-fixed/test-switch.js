"use strict";
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
// Basic switch statement
function getDayName(dayNum) {
    let dayName;
    switch (dayNum) {
        case 0:
            dayName = 'Sunday';
            break;
        case 1:
            dayName = 'Monday';
            break;
        case 2:
            dayName = 'Tuesday';
            break;
        case 3:
            dayName = 'Wednesday';
            break;
        case 4:
            dayName = 'Thursday';
            break;
        case 5:
            dayName = 'Friday';
            break;
        case 6:
            dayName = 'Saturday';
            break;
        default:
            dayName = 'Invalid day';
    }
    return dayName;
}
// Switch with fall-through
function getQuarterMonths(quarter) {
    let months = [];
    switch (quarter) {
        case 1:
            months.push('January');
            months.push('February');
            months.push('March');
            break;
        case 2:
            months.push('April');
            months.push('May');
            months.push('June');
            break;
        case 3:
            months.push('July');
            months.push('August');
            months.push('September');
            break;
        case 4:
            months.push('October');
            months.push('November');
            months.push('December');
            break;
        default:
            months.push('Invalid quarter');
    }
    return months;
}
// Switch with return statements
function getGradeDescription(grade) {
    switch (grade) {
        case 'A':
            return 'Excellent';
        case 'B':
            return 'Good';
        case 'C':
            return 'Average';
        case 'D':
            return 'Below Average';
        case 'F':
            return 'Failing';
        default:
            return 'Invalid Grade';
    }
}
// Test the functions
console.log('Testing switch instrumentation:');
console.log('---------------------------------------');
console.log('getDayName(1):', getDayName(1));
console.log('getDayName(6):', getDayName(6));
console.log('getDayName(9):', getDayName(9));
console.log('\ngetQuarterMonths(2):', getQuarterMonths(2));
console.log('getQuarterMonths(4):', getQuarterMonths(4));
console.log('\ngetGradeDescription("A"):', getGradeDescription('A'));
console.log('getGradeDescription("C"):', getGradeDescription('C'));
console.log('getGradeDescription("Z"):', getGradeDescription('Z'));
// Print coverage report
COVERAGE_TRACKER.printReport();
