import typescriptEslint from "typescript-eslint";

const eslintConfig = [
  ...typescriptEslint.configs.recommended,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
