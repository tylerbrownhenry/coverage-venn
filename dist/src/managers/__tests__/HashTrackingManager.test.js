"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HashTrackingManager_1 = require("../HashTrackingManager");
const FileHasher_1 = require("../../utils/FileHasher");
jest.mock('fs/promises');
jest.mock('../../utils/FileHasher');
describe('HashTrackingManager', () => {
    let manager;
    beforeEach(() => {
        manager = new HashTrackingManager_1.HashTrackingManager('.test-store.json');
        jest.resetAllMocks();
    });
    it('should track new files', async () => {
        const mockHash = 'abc123';
        FileHasher_1.FileHasher.hashFile.mockResolvedValue(mockHash);
        const result = await manager.trackFile('test.tsx', ['TestComponent']);
        expect(result.hash).toBe(mockHash);
        expect(result.relatedComponents).toContain('TestComponent');
    });
    it('should detect changed files', async () => {
        FileHasher_1.FileHasher.hashFile
            .mockResolvedValueOnce('hash1')
            .mockResolvedValueOnce('hash2');
        await manager.trackFile('test.tsx');
        const hasChanged = await manager.hasFileChanged('test.tsx');
        expect(hasChanged).toBe(true);
    });
});
