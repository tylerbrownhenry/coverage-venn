export interface ComponentLog {
    id: string;
    timestamp: number;
    context: string;
}
export declare class LogTracker {
    private static logs;
    static track(componentId: string): void;
    private static getCurrentContext;
}
