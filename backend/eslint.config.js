export default [
    {
      // Specify the environments your script is designed to run in
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true, // If you're using JSX
        },
      },
      // Extend recommended ESLint rules
      extends: ['eslint:recommended'],
      // Define plugins if needed
      plugins: {
        // Example: 'react': require('eslint-plugin-react'),
      },
      // Specify custom rules
      rules: {
        semi: ['error', 'always'],
        quotes: ['error', 'single'],
        'no-unused-vars': ['warn'],
        // Add more custom rules as needed
      },
      // Ignore specific files or directories
      ignores: ['node_modules/', 'dist/', 'src/.DS_Store', '.DS_Store'],
    },
  ];