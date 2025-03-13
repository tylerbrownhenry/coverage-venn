/**
 * Types for the coverage module
 */
/**
 * Represents coverage data for a component
 */
export interface ComponentCoverage {
    /**
     * Component name
     */
    name: string;
    /**
     * File path of the component
     */
    path: string;
    /**
     * Coverage percentages by type
     */
    coverage: {
        statements?: number;
        branches?: number;
        functions?: number;
        lines?: number;
        [key: string]: number | undefined;
    };
    /**
     * Test files that cover this component
     */
    coveredBy: string[];
    /**
     * Additional metadata
     */
    metadata?: {
        [key: string]: any;
    };
}
