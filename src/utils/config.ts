import * as path from 'path';

interface ConfigOptions {
  configPath?: string;
  required?: boolean;
}

export function getConfig(name: string, options: ConfigOptions = {}): any {
  const configPaths = [
    options.configPath,
    process.env[`${name.toUpperCase()}_CONFIG_PATH`],
    path.join(process.cwd(), `config/${name}.config.js`),
    path.join(process.cwd(), `.${name}rc.js`),
    path.join(process.cwd(), `.${name}rc.json`)
  ].filter((p): p is string => Boolean(p));

  for (const configPath of configPaths) {
    try {
      console.log('Trying config path:', configPath);
      const resolvedPath = require.resolve(configPath);
      const config = require(resolvedPath);
      console.log('Loaded config from:', resolvedPath);
      return config;
    } catch (error) {
      console.log('Failed to load config from:', configPath);
      continue;
    }
  }

  if (options.required) {
    throw new Error(`Could not find config for ${name} in: ${configPaths.join(', ')}`);
  }

  return {};
}
