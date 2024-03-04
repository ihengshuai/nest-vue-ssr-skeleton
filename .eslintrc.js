module.exports = {
  root: true,
  extends: [
    "standard-vue-ts"
  ],
  globals: {
    __isBrowser__: "readonly",
    defineEmits: "readonly",
    defineProps: "readonly",
    withDefaults: "readonly",
    defineExpose: "readonly"
  },
  rules: {
    indent: ["error", 2, { SwitchCase: 1 }],
    quotes: ["error", "double"],
    semi: ["error", "always"],
    camelcase: "off",
    "no-new": "off",
    "func-call-spacing": "off",
    "standard/no-callback-literal": "off",
    "no-template-curly-in-string": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/quotes": ["error", "double"],
    "@typescript-eslint/semi": ["error", "always"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "@typescript-eslint/space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always"
      }
    ],
    "@typescript-eslint/member-delimiter-style": ["error", {
      multiline: {
        delimiter: "semi",
        requireLast: true
      },
      singleline: {
        delimiter: "semi",
        requireLast: false
      },
      multilineDetection: "brackets"
    }],
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
    "@typescript-eslint/return-await": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/require-array-sort-compare": "off",
    "vue/html-indent": ["error", 2],
    "vue/require-component-is": "off",
    "vue/one-component-per-file": "off",
    "vue/require-default-prop": "off",
    "vue/no-v-html": "off"
  }
};
