/**
 * Data processing utilities with error handling and complex branching
 */
export interface DataItem {
    id: string | number;
    value: any;
    timestamp?: Date;
    metadata?: Record<string, any>;
}
export interface ProcessedData {
    success: boolean;
    data?: DataItem[];
    error?: string;
    stats?: {
        total: number;
        valid: number;
        invalid: number;
        processed: number;
    };
}
/**
 * Process an array of data items with error handling
 */
export declare function processData(items: any[], options?: {
    validate?: boolean;
    transform?: boolean;
    sort?: 'asc' | 'desc' | null;
    limit?: number;
    filterInvalid?: boolean;
}): ProcessedData;
