/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "plugin:vue/vue3-strongly-recommended",
    "plugin:vue/vue3-recommended",
    "plugin:vuejs-accessibility/recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
    "plugin:jsdoc/recommended-typescript",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    /**
     * @see {@link https://eslint.vuejs.org/rules/block-lang.html} for further information.
     */
    "vue/block-lang": [
      "error",
      {
        script: {
          lang: "ts",
        },
      },
    ],
    /**
     * @see {@link https://eslint.vuejs.org/rules/component-api-style.html} for further information.
     */
    "vue/component-api-style": ["error", ["script-setup", "composition"]],
    /**
     * @see {@link https://eslint.vuejs.org/rules/custom-event-name-casing.html} for further information.
     */
    "vue/custom-event-name-casing": [
      "error",
      "camelCase",
      {
        ignores: [],
      },
    ],
    /**
     * @see {@link https://eslint.vuejs.org/rules/define-emits-declaration.html} for further information.
     */
    "vue/define-emits-declaration": ["error", "type-based"],
    /**
     * @see {@link https://eslint.vuejs.org/rules/define-props-declaration.html} for further information.
     */
    "vue/define-props-declaration": ["error", "type-based"],
    /**
     * @see {@link https://eslint.vuejs.org/rules/html-button-has-type.html} for further information.
     */
    "vue/html-button-has-type": [
      "error",
      {
        button: true,
        submit: true,
        reset: true,
      },
    ],
    /**
     * @see {@link https://eslint.vuejs.org/rules/no-template-target-blank.html} for further information.
     */
    "vue/no-template-target-blank": [
      "error",
      {
        allowReferrer: false,
        enforceDynamicLinks: "always",
      },
    ],
    /**
     * @see {@link https://eslint.vuejs.org/rules/prefer-true-attribute-shorthand.html} for further information.
     */
    "vue/prefer-true-attribute-shorthand": ["error", "always"],
    /**
     * @see {@link https://eslint.vuejs.org/rules/require-macro-variable-name.html} for further information.
     */
    "vue/require-macro-variable-name": [
      "error",
      {
        defineProps: "props",
        defineEmits: "emit",
        defineSlots: "slots",
        useSlots: "slots",
        useAttrs: "attrs",
      },
    ],
    "vuejs-accessibility/label-has-for": "off",
    "jsdoc/check-tag-names": ["warn", { definedTags: ["pattern"] }],
    "jsdoc/check-indentation": 1,
    "jsdoc/check-line-alignment": 1,
    "jsdoc/check-syntax": 1,
    "jsdoc/sort-tags": 1,
  },
};
