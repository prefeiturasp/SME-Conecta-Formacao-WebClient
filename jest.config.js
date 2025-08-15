export default {
  collectCoverage: false,
  coverageReporters: ['text', 'lcov', 'json', 'html'],
  coverageDirectory: 'coverage',
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      useESM: true,
    }],
    '^.+\\.(js|jsx)$': ['babel-jest'],
    '^.+\\.(svg|jpg|jpeg|png|woff|woff2|eot|ttf|otf)$': 'jest-transform-stub',
  },
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
    '\\.(svg|jpg|jpeg|png|woff|woff2|eot|ttf|otf)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|css\\.js)$': 'identity-obj-proxy',
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/@legacy/**/*.{js,jsx,ts,tsx}',
    'src/pages/**/*.{js,jsx,ts,tsx}',
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__mocks__/**',
    '!src/**/*.css.js',
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 1,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transformIgnorePatterns: [
    '/node_modules/(?!(antd|@ant-design|rc-.+|@babel/runtime)/).*/',
  ],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: {
        jsx: 'react-jsx'
      }
    },
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
  coverageProvider: 'v8',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/build/',
    '/dist/',
    '/__mocks__/',
    '/.*.d.ts$/',
    '/.*.config.js$/',
    '/.*.test.js$/',
    '/.*.css.js$/',
    '/src/index\\.tsx$',
    '/src/@types',
    '/src/app\\.tsx$',
    '/.*\\/style\\.js$',
  ],
};