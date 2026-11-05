import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Utility/API modules intentionally export more than one binding, so the
    // "only export components" rule must not apply to them.
    files: [
      'src/apicalls/**/*.{js,jsx}',
      'src/components/toast/**/*.{js,jsx}',
      'src/app_context/**/*.{js,jsx}',
      'src/utils/**/*.{js,jsx}',
      'src/config/**/*.{js,jsx}',
      // The entry file renders the app and intentionally exports nothing.
      'src/main.jsx',
    ],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
