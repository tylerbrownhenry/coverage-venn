import '@testing-library/jest-dom';
declare global {
    interface Window {
        mockComponent: (name: string) => {
            name: string;
            timestamp: number;
        };
    }
}
