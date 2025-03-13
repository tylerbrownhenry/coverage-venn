import * as t from '@babel/types';
import { ComponentNode } from '../scanners/ComponentHierarchyScanner';
export interface ElementType {
    type: string;
    variant?: string;
    role?: string;
}
export interface TestIdRecommendation {
    elementId: string;
    elementType: ElementType;
    elementPath: string;
    recommendedTestId: string;
    confidence: number;
    reason: string;
}
export declare class TestIdGenerator {
    private validator;
    constructor();
    /**
     * Generate recommended testIDs for a component
     * @param component The component to analyze
     * @param ast The AST of the component
     */
    generateRecommendations(component: ComponentNode, ast: t.File): TestIdRecommendation[];
    /**
     * Check if an element already has a testID
     */
    private hasTestId;
    /**
     * Traverse all JSX elements in an AST
     */
    private traverseJsxElements;
    /**
     * Get the name of a JSX element
     */
    private getElementName;
    /**
     * Analyze a JSX element to determine its type and properties
     */
    private analyzeElement;
    /**
     * Generate a testID for an element based on component and element type
     */
    private generateTestIdForElement;
    /**
     * Calculate confidence score for a recommendation
     */
    private calculateConfidence;
    /**
     * Check if an element is interactive
     */
    private isInteractiveElement;
    /**
     * Generate a reason for the recommendation
     */
    private generateReason;
    /**
     * Get a string representation of the element's path in the component
     */
    private getElementPath;
    /**
     * Detect interactive elements in a component
     */
    detectInteractiveElements(ast: t.File): ElementType[];
}
