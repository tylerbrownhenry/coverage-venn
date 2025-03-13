export let testEnvironment: string;
export let roots: string[];
export let testMatch: string[];
export let collectCoverageFrom: string[];
export let modulePathIgnorePatterns: string[];
export let setupFilesAfterEnv: string[];
export let testTimeout: number;
export let transform: {
    '^.+\\.(ts|tsx)$': string;
    '^.+\\.(js|jsx)$': string;
};
export let transformIgnorePatterns: string[];
export let moduleNameMapper: {
    "coverage-tracker": string;
    "coverage-instrumentation-plugin": string;
    "\\./coverage-tracker": string;
    "\\./coverage-instrumentation-plugin": string;
    "^.+/src/coverage-tracker$": string;
};
