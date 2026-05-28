import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Extend the recommended ESLint configurations for Next.js and TypeScript
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Add Prettier configuration to disable conflicting ESLint rules
  ...compat.extends('plugin:prettier/recommended'),
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json', // Ensure ESLint uses the TypeScript config file
      },
    },
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      'no-console': 'warn',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      curly: 'error',
      eqeqeq: ['error', 'always'],
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-magic-numbers': [
        'warn',
        { ignoreArrayIndexes: true, ignore: [0, 1] },
      ],
      'no-shadow': 'warn',
      'prefer-template': 'error',
      'consistent-return': 'warn',
    },
  },
]

export default eslintConfig
