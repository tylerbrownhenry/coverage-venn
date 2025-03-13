export let preset: string;
export let testEnvironment: string;
export let globals: {
    'ts-jest': {
        tsconfig: string;
    };
};
export let rootDir: string;
export let roots: string[];
export let transform: {
    '^.+\\.tsx?$': (string | {
        tsconfig: string;
        isolatedModules: boolean;
    })[];
};
export let testMatch: string[];
export let collectCoverageFrom: string[];
export let moduleNameMapper: {
    '^@/(.*)$': string;
};
export let setupFilesAfterEnv: string[];
export let testPathIgnorePatterns: string[];
export let clearMocks: boolean;
export let coverageDirectory: string;
export let coverageReporters: string[];
export let coverageProvider: string;
export let coveragePathIgnorePatterns: string[];
export let collectCoverage: boolean;
export let automock: boolean;
export let verbose: boolean;
