"use strict";
// Import coverage tracker
const COVERAGE_TRACKER = require('./coverage-tracker');
// Basic switch statement
function getDayName(dayNum) {
    COVERAGE_TRACKER.trackFunctionStart("getDayName", "TestFile", 0);
    let dayName;
    switch (COVERAGE_TRACKER.trackSwitch("TestFile", 0, dayNum)) {
        case 0:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 0);
            dayName = 'Sunday';
            break;
        case 1:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 1);
            dayName = 'Monday';
            break;
        case 2:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 2);
            dayName = 'Tuesday';
            break;
        case 3:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 3);
            dayName = 'Wednesday';
            break;
        case 4:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 4);
            dayName = 'Thursday';
            break;
        case 5:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 5);
            dayName = 'Friday';
            break;
        case 6:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 6);
            dayName = 'Saturday';
            break;
        default:
            COVERAGE_TRACKER.trackSwitch("TestFile", 0, undefined, 7);
            dayName = 'Invalid day';
    }
    return dayName;
}
// Switch with fall-through
function getQuarterMonths(quarter) {
    COVERAGE_TRACKER.trackFunctionStart("getQuarterMonths", "TestFile", 1);
    let months = [];
    switch (COVERAGE_TRACKER.trackSwitch("TestFile", 1, quarter)) {
        case 1:
            COVERAGE_TRACKER.trackSwitch("TestFile", 1, undefined, 0);
            months.push('January');
            months.push('February');
            months.push('March');
            break;
        case 2:
            COVERAGE_TRACKER.trackSwitch("TestFile", 1, undefined, 1);
            months.push('April');
            months.push('May');
            months.push('June');
            break;
        case 3:
            COVERAGE_TRACKER.trackSwitch("TestFile", 1, undefined, 2);
            months.push('July');
            months.push('August');
            months.push('September');
            break;
        case 4:
            COVERAGE_TRACKER.trackSwitch("TestFile", 1, undefined, 3);
            months.push('October');
            months.push('November');
            months.push('December');
            break;
        default:
            COVERAGE_TRACKER.trackSwitch("TestFile", 1, undefined, 4);
            months.push('Invalid quarter');
    }
    return months;
}
// Switch with return statements
function getGradeDescription(grade) {
    COVERAGE_TRACKER.trackFunctionStart("getGradeDescription", "TestFile", 2);
    switch (COVERAGE_TRACKER.trackSwitch("TestFile", 2, grade)) {
        case 'A':
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 0);
            return 'Excellent';
        case 'B':
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 1);
            return 'Good';
        case 'C':
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 2);
            return 'Average';
        case 'D':
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 3);
            return 'Below Average';
        case 'F':
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 4);
            return 'Failing';
        default:
            COVERAGE_TRACKER.trackSwitch("TestFile", 2, undefined, 5);
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
