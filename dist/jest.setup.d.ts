import '@testing-library/jest-dom';
declare global {
    var mockComponent: (name: string) => {
        name: string;
        timestamp: number;
    };
}
