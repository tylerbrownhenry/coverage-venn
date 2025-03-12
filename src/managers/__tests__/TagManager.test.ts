import { TagManager, TagDefinition } from '../TagManager';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('TagManager', () => {
  let manager: TagManager;
  let mockDate: jest.SpyInstance;
  const testDate = new Date('2025-03-09T13:43:49.852Z');

  beforeEach(() => {
    manager = new TagManager('/test');
    jest.resetAllMocks();
    
    // Mock fs.readFile to return an empty JSON array
    (fs.readFile as jest.Mock).mockResolvedValue('[]');
    
    // Mock fs.writeFile to do nothing
    (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
    
    // Mock Date globally
    mockDate = jest.spyOn(global, 'Date').mockImplementation(() => testDate as any);
  });
  
  afterEach(() => {
    mockDate.mockRestore();
  });

  it('should register valid tags', async () => {
    const tag: TagDefinition = {
      name: '@root_component',
      components: ['src/components/Test.tsx'],
      relationships: [],
      category: 'component',
      metadata: {
        createdAt: testDate.toISOString(),
        updatedAt: testDate.toISOString()
      }
    };

    await manager.registerTag(tag);
    const components = await manager.getTagsByComponent('src/components/Test.tsx');
    
    // Check if a tag with the same name exists in the components array
    expect(components.length).toBe(1);
    expect(components[0].name).toBe(tag.name);
    expect(components[0].components).toEqual(tag.components);
    expect(components[0].category).toBe(tag.category);
  });

  it('should reject invalid tag names', async () => {
    const tag: TagDefinition = {
      name: 'invalid',
      components: ['src/components/Test.tsx'],
      relationships: [],
      category: 'component',
      metadata: {
        createdAt: testDate.toISOString(),
        updatedAt: testDate.toISOString()
      }
    };

    await expect(manager.registerTag(tag)).rejects.toThrow();
  });
});
