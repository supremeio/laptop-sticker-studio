module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/figma\\.com.*api.*mcp.*asset/]",
        message: "Do not use temporary Figma asset URLs. Download the asset to public/assets/ and reference it locally."
      }
    ]
  },
}
