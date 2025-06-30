import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  // Configuration globale
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/build/",
      "**/.next/",
      "**/*.config.js", // ignore les fichiers de config eux-mêmes
      "**/*.config.mjs",
    ],
  },

  // Configuration recommandée par ESLint
  js.configs.recommended,

  // Configuration TypeScript
  ...ts.configs.recommended,

  // Configuration Prettier (doit TOUJOURS être à la fin)
  // Désactive les règles ESLint qui pourraient entrer en conflit avec Prettier
  prettier,

  // Règles personnalisées (optionnel)
  {
    rules: {
      "prettier/prettier": "off", // On laisse Prettier formater, pas besoin d'une règle ESLint pour ça
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
