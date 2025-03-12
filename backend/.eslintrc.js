module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    node: true,
    jest: true
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_' 
    }],
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': 'off'
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/__tests__/**/*.ts', '**/test/**/*.ts'],
      parserOptions: {
        project: './tsconfig.test.json'
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/ban-types': 'off'
      }
    }
  ],
  ignorePatterns: ['**/*.test.ts', '**/__tests__/**/*.ts', '**/test/**/*.ts']
}; 