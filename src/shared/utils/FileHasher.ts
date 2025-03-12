import * as crypto from 'crypto';
import * as fs from 'fs/promises';

export class FileHasher {
  static async hashFile(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath);
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }

  static async hashContent(content: string): Promise<string> {
    return crypto
      .createHash('sha256')
      .update(content)
      .digest('hex');
  }
}
