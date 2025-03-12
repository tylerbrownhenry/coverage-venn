import { getConfig } from '../config';
import * as path from 'path';

// Just mock the console.log to avoid noise in tests
jest.spyOn(console, 'log').mockImplementation(() => {});

describe('getConfig', () => {
  // Store original require and process.env
  const originalEnv = process.env;
  
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  it('should throw error when required config is missing', () => {
    expect(() => getConfig('missing', { required: true }))
      .toThrow('Could not find config');
  });

  it('should return empty object when no config is found', () => {
    const config = getConfig('missing');
    expect(config).toEqual({});
  });
});
