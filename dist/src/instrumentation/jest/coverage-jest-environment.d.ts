export = CoverageJestEnvironment;
declare class CoverageJestEnvironment {
    constructor(config: any, context: any);
    teardown(): Promise<void>;
}
