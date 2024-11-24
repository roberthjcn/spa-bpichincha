module.exports = {
 preset: 'jest-preset-angular',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/*.spec.ts',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
  modulePathIgnorePatterns: [
    '/src/app/app.config.ts', 
    'src/app/app.routes.ts',
    'src/app/app.component.ts'
  ],
  
}