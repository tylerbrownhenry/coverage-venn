import { HashTrackingManager } from '../HashTrackingManager';
import { FileHasher } from '../../utils/FileHasher';
import * as fs from 'fs/promises';

jest.mock('fs/promises');
jest.mock('../../utils/FileHasher');

describe('HashTrackingManager', () => {
  let manager: HashTrackingManager;

  beforeEach(() => {
    manager = new HashTrackingManager('.test-store.json');
    jest.resetAllMocks();
  });

  it('should track new files', async () => {
    const mockHash = 'abc123';
    (FileHasher.hashFile as jest.Mock).mockResolvedValue(mockHash);

    const result = await manager.trackFile('test.tsx', ['TestComponent']);
    
    expect(result.hash).toBe(mockHash);
    expect(result.relatedComponents).toContain('TestComponent');
  });

  it('should detect changed files', async () => {
    (FileHasher.hashFile as jest.Mock)
      .mockResolvedValueOnce('hash1')
      .mockResolvedValueOnce('hash2');

    await manager.trackFile('test.tsx');
    const hasChanged = await manager.hasFileChanged('test.tsx');
    
    expect(hasChanged).toBe(true);
  });
});
