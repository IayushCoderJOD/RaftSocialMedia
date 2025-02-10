export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', 
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], 
  };
  