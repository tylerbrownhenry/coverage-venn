interface ConfigOptions {
    configPath?: string;
    required?: boolean;
}
export declare function getConfig(name: string, options?: ConfigOptions): any;
export {};
