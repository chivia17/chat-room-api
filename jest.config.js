module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testMatch: [
      '**/__tests__/**/*.+(js|jsx|ts|tsx)',
      '**/?(*.)+(spec|test).+(js|jsx|ts|tsx)'
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    transformIgnorePatterns: [
      '/node_modules/',
    ],
    testEnvironment: 'node'
  };
