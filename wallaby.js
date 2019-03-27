const ngxWallabyJest = require('ngx-wallaby-jest');

module.exports = function(wallaby) {
  return {
    files: [
      'projects/yeast/**/*.+(ts|html|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      '!projects/yeast/**/*.spec.ts',
    ],

    tests: ['projects/yeast/**/*.spec.ts'],

    env: {
      type: 'node',
      runner: 'node',
    },
    compilers: {
      'projects/yeast/**/*.ts?(x)': wallaby.compilers.typeScript({ module: 'commonjs' }),
    },
    preprocessors: {
      // This translate templateUrl and styleUrls to the right implementation
      // For wallaby
      'projects/yeast/**/*.component.ts': ngxWallabyJest,
    },
    testFramework: 'jest',
    setup: () => {
      wallaby.testFramework.configure({
        transform: {
          '^.+\\.(ts|js|html)$': 'jest-preset-angular/preprocessor.js'
        },
        moduleNameMapper: {
          "@yeast/(.*)": "<rootDir>/projects/yeast/$1/src/public_api.ts",
        },
        modulePathIgnorePatterns: [
          "<rootDir>/dist/"
        ],
      });
    }
  };
};
