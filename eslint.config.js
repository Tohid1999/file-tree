import globals from "globals";
import tseslint from "typescript-eslint";
import eslintReact from "@eslint-react/eslint-plugin";
import hooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierConfig from "eslint-config-prettier";
import js from "@eslint/js";

export default tseslint.config(
  {
    ignores: ["dist", "node_modules", ".eslintrc.cjs"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": hooks,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...hooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },
  prettierConfig
);