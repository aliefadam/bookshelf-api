import globals from "globals";
import pluginJs from "@eslint/js";
import daStyle from "eslint-config-dicodingacademy";

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "linebreak-style": "off",
    },
  },
  pluginJs.configs.recommended,
  daStyle,
];
