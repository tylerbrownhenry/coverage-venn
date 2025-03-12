import { FileHasher } from '../FileHasher';
import * as fs from 'fs/promises';
import * as crypto from 'crypto';

// Mock fs.readFile
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

// Mock crypto
jest.mock('crypto', () => {
  const mockDigest = jest.fn().mockReturnValue('mockedHash');
  const mockUpdate = jest.fn().mockReturnValue({ digest: mockDigest });
  const mockCreateHash = jest.fn().mockReturnValue({ update: mockUpdate });
  
  return {
    createHash: mockCreateHash,
  };
});

describe('FileHasher', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('hashFile', () => {
    it('should hash file content using sha256', async () => {
      // Arrange
      const testFilePath = '/path/to/test/file.ts';
      const testFileContent = 'test file content';
      (fs.readFile as jest.Mock).mockResolvedValue(Buffer.from(testFileContent));

      // Act
      const result = await FileHasher.hashFile(testFilePath);

      // Assert
      expect(fs.readFile).toHaveBeenCalledWith(testFilePath);
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(result).toBe('mockedHash');
    });

    it('should propagate file read errors', async () => {
      // Arrange
      const testFilePath = '/path/to/nonexistent/file.ts';
      const mockError = new Error('File not found');
      (fs.readFile as jest.Mock).mockRejectedValue(mockError);

      // Act & Assert
      await expect(FileHasher.hashFile(testFilePath)).rejects.toThrow('File not found');
      expect(fs.readFile).toHaveBeenCalledWith(testFilePath);
    });
  });

  describe('hashContent', () => {
    it('should hash string content using sha256', async () => {
      // Arrange
      const content = 'test content to hash';

      // Act
      const result = await FileHasher.hashContent(content);

      // Assert
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
      expect(result).toBe('mockedHash');
    });
  });
}); 