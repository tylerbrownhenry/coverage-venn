export = config;
declare const config: {
    preset: string;
    testEnvironment: string;
    globals: {
        'ts-jest': {
            tsconfig: string;
        };
    };
    rootDir: string;
    roots: string[];
    transform: {
        '^.+\\.tsx?$': (string | {
            tsconfig: string;
            isolatedModules: boolean;
        })[];
    };
    testMatch: string[];
    collectCoverageFrom: string[];
    moduleNameMapper: {
        '^@/(.*)$': string;
    };
    setupFilesAfterEnv: string[];
    testPathIgnorePatterns: string[];
    clearMocks: boolean;
    coverageDirectory: string;
    coverageReporters: string[];
    coverageProvider: string;
    coveragePathIgnorePatterns: string[];
    collectCoverage: boolean;
    automock: boolean;
    verbose: boolean;
};
