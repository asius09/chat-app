import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Base JS config for all JS files
  {
    files: ['**/*.{js,cjs,mjs}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    extends: ['eslint:recommended'],
    rules: {},
  },

  // TypeScript config for all packages and apps
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
    languageOptions: {
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Backend (Express) specific config
  {
    files: ['app/backend/**/*.{js,ts}'],
    languageOptions: {
      globals: {
        ...require('globals').node,
      },
    },
    rules: {
      // Backend-specific rules can go here
    },
  },

  // Browser (Next.js) specific config
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['app/browser/**/*.{js,jsx,ts,tsx}'],
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
    // You can add browser-specific rules here if needed
  },

  // Mobile (Expo/React Native) specific config
  {
    files: ['app/mobile/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...require('globals').browser,
      },
    },
    extends: ['plugin:react/recommended', 'plugin:react-native/all'],
    plugins: {
      react: require('eslint-plugin-react'),
      'react-native': require('eslint-plugin-react-native'),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Mobile-specific rules can go here
    },
  },
];
