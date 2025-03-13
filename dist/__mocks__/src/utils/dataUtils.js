"use strict";
/**
 * Data processing utilities with error handling and complex branching
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.processData = processData;
/**
 * Process an array of data items with error handling
 */
function processData(items, options = {}) {
    // Default options
    const { validate = true, transform = true, sort = null, limit = 0, filterInvalid = false } = options;
    // Initialize result
    const result = {
        success: true,
        data: [],
        stats: {
            total: items.length,
            valid: 0,
            invalid: 0,
            processed: 0
        }
    };
    // Early return for empty arrays
    if (!items || items.length === 0) {
        result.success = true;
        result.data = [];
        return result;
    }
    try {
        let processedItems = [];
        // Process each item
        for (const item of items) {
            try {
                // Validation branch
                if (validate) {
                    if (!validateItem(item)) {
                        result.stats.invalid++;
                        if (filterInvalid)
                            continue;
                    }
                    else {
                        result.stats.valid++;
                    }
                }
                // Transformation branch
                let processedItem;
                if (transform) {
                    processedItem = transformItem(item);
                }
                else {
                    processedItem = normalizeItem(item);
                }
                // Add the item to results
                processedItems.push(processedItem);
                result.stats.processed++;
            }
            catch (itemError) {
                result.stats.invalid++;
                console.error(`Error processing item:`, itemError);
                // Decide whether to continue or not based on filterInvalid
                if (filterInvalid)
                    continue;
            }
        }
        // Sorting branch
        if (sort === 'asc') {
            processedItems = processedItems.sort((a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return a.value - b.value;
                }
                return String(a.value).localeCompare(String(b.value));
            });
        }
        else if (sort === 'desc') {
            processedItems = processedItems.sort((a, b) => {
                if (typeof a.value === 'number' && typeof b.value === 'number') {
                    return b.value - a.value;
                }
                return String(b.value).localeCompare(String(a.value));
            });
        }
        // Limiting branch
        if (limit > 0 && processedItems.length > limit) {
            processedItems = processedItems.slice(0, limit);
        }
        result.data = processedItems;
    }
    catch (error) {
        result.success = false;
        result.error = error.message || 'Unknown error occurred during data processing';
        console.error('Data processing failed:', error);
    }
    return result;
}
/**
 * Validate if an item has the required properties
 */
function validateItem(item) {
    // Check if item is an object
    if (!item || typeof item !== 'object') {
        return false;
    }
    // Check for required id property
    if (item.id === undefined || item.id === null) {
        return false;
    }
    // Check if id is valid
    if (typeof item.id !== 'string' && typeof item.id !== 'number') {
        return false;
    }
    // Check for required value property
    if (item.value === undefined) {
        return false;
    }
    // Additional validations for specific types
    if (item.timestamp && !(item.timestamp instanceof Date)) {
        try {
            // Try to convert to Date if it's a string
            new Date(item.timestamp);
        }
        catch {
            return false;
        }
    }
    // Valid item
    return true;
}
/**
 * Transform an item with additional derived properties
 */
function transformItem(item) {
    const normalized = normalizeItem(item);
    // Add additional metadata based on item type
    if (!normalized.metadata) {
        normalized.metadata = {};
    }
    // Add type information
    normalized.metadata.type = typeof normalized.value;
    // Add length for string values
    if (typeof normalized.value === 'string') {
        normalized.metadata.length = normalized.value.length;
    }
    // Add range information for numbers
    if (typeof normalized.value === 'number') {
        normalized.metadata.isPositive = normalized.value > 0;
        normalized.metadata.isInteger = Number.isInteger(normalized.value);
    }
    // Add array information
    if (Array.isArray(normalized.value)) {
        normalized.metadata.count = normalized.value.length;
        normalized.metadata.isEmpty = normalized.value.length === 0;
    }
    // Add transformed timestamp if not present
    if (!normalized.timestamp) {
        normalized.timestamp = new Date();
    }
    return normalized;
}
/**
 * Normalize an item to ensure it has the correct shape
 */
function normalizeItem(item) {
    return {
        id: item.id,
        value: item.value,
        timestamp: item.timestamp ? new Date(item.timestamp) : undefined,
        metadata: item.metadata ? { ...item.metadata } : undefined
    };
}
