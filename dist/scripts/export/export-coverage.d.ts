/**
 * Export Coverage Data Module
 *
 * This module provides functionality to export coverage data in various formats (JSON, CSV, HTML).
 */
/**
 * Adds export controls to the HTML report
 * @param html The HTML content to modify
 * @returns Modified HTML with export controls
 */
export declare function addExportControls(html: string): string;
/**
 * Modifies the main HTML report to include export functionality
 * @param htmlFilePath Path to the HTML report file
 */
export declare function addExportToReport(htmlFilePath: string): Promise<void>;
