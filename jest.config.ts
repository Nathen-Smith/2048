import type { Config } from 'jest';

const config: Config = {
  verbose: true,
  testPathIgnorePatterns: ['/__utils__/']
};

export default config;
