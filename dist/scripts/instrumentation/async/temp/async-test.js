"use strict";
/**
 * Test file for async function and promise instrumentation
 *
 * This file tests various patterns of async functions and promises
 * to ensure our instrumentation works correctly.
 */
// Simple async function with await
async function fetchData() {
    try {
        console.log('Fetching data...');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Data fetched successfully');
        return { success: true, data: { id: 1, name: 'Test' } };
    }
    catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, error };
    }
}
// Async arrow function
const processData = async (data) => {
    console.log('Processing data...');
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 50));
    return { ...data, processed: true };
};
// Function returning a promise (not using async/await)
function saveData(data) {
    console.log('Saving data...');
    return new Promise((resolve, reject) => {
        // Simulate database operation
        setTimeout(() => {
            if (data.id) {
                resolve({ success: true, id: data.id });
            }
            else {
                reject(new Error('Invalid data: missing ID'));
            }
        }, 80);
    });
}
// Async function with multiple awaits and conditional paths
async function complexOperation(condition) {
    console.log('Starting complex operation...');
    const data = await fetchData();
    if (!data.success) {
        console.error('Failed to fetch data');
        return { success: false, stage: 'fetch' };
    }
    const processedData = condition
        ? await processData(data.data)
        : data.data;
    try {
        const result = await saveData(processedData);
        console.log('Operation completed successfully');
        return { success: true, result };
    }
    catch (error) {
        console.error('Failed to save data:', error);
        return { success: false, stage: 'save', error };
    }
}
// Promise.all usage
async function batchProcess(items) {
    console.log(`Processing ${items.length} items in parallel...`);
    try {
        const results = await Promise.all(items.map(item => processData(item)));
        console.log('Batch processing completed');
        return results;
    }
    catch (error) {
        console.error('Error in batch processing:', error);
        throw error;
    }
}
// Promise chaining (without async/await)
function chainedOperations() {
    return fetchData()
        .then(result => {
        if (!result.success) {
            throw new Error('Fetch failed in chain');
        }
        return processData(result.data);
    })
        .then(processed => saveData(processed))
        .then(saveResult => {
        console.log('Chain completed successfully');
        return saveResult;
    })
        .catch(error => {
        console.error('Error in promise chain:', error);
        return { success: false, error };
    });
}
// Immediately Invoked Async Function Expression (IIAFE)
(async function () {
    console.log('Running tests...');
    try {
        // Test 1: Simple async function
        const fetchResult = await fetchData();
        console.log('Fetch result:', fetchResult.success);
        // Test 2: Complex operation with condition = true
        const complexResult1 = await complexOperation(true);
        console.log('Complex operation (true):', complexResult1.success);
        // Test 3: Complex operation with condition = false
        const complexResult2 = await complexOperation(false);
        console.log('Complex operation (false):', complexResult2.success);
        // Test 4: Batch processing
        const batchResult = await batchProcess([
            { id: 2, name: 'Test 2' },
            { id: 3, name: 'Test 3' }
        ]);
        console.log('Batch processing complete, processed', batchResult.length, 'items');
        // Test 5: Promise chaining
        const chainResult = await chainedOperations();
        console.log('Chain result:', chainResult.success);
        console.log('All tests completed successfully');
    }
    catch (error) {
        console.error('Test suite failed:', error);
    }
})();
