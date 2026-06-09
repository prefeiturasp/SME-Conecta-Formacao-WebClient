module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(svg|png|jpg|jpeg|gif|ico)$': '<rootDir>/__mocks__/file-mock.cjs',
    '^~/(.*)$': '<rootDir>/src/$1',
    '^query-string$': '<rootDir>/__mocks__/query-string.cjs',
  },
  transform: {
    '^.+\\.tsx?$': [
      '<rootDir>/jest.import-meta-transform.cjs',
      {
        tsconfig: {
          jsx: 'react-jsx',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
    '!src/components/main/**',
    '!src/pages/**',
  ],
};
