"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const FileHasher_1 = require("../FileHasher");
const fs = __importStar(require("fs/promises"));
const crypto = __importStar(require("crypto"));
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
            fs.readFile.mockResolvedValue(Buffer.from(testFileContent));
            // Act
            const result = await FileHasher_1.FileHasher.hashFile(testFilePath);
            // Assert
            expect(fs.readFile).toHaveBeenCalledWith(testFilePath);
            expect(crypto.createHash).toHaveBeenCalledWith('sha256');
            expect(result).toBe('mockedHash');
        });
        it('should propagate file read errors', async () => {
            // Arrange
            const testFilePath = '/path/to/nonexistent/file.ts';
            const mockError = new Error('File not found');
            fs.readFile.mockRejectedValue(mockError);
            // Act & Assert
            await expect(FileHasher_1.FileHasher.hashFile(testFilePath)).rejects.toThrow('File not found');
            expect(fs.readFile).toHaveBeenCalledWith(testFilePath);
        });
    });
    describe('hashContent', () => {
        it('should hash string content using sha256', async () => {
            // Arrange
            const content = 'test content to hash';
            // Act
            const result = await FileHasher_1.FileHasher.hashContent(content);
            // Assert
            expect(crypto.createHash).toHaveBeenCalledWith('sha256');
            expect(result).toBe('mockedHash');
        });
    });
});
