module.exports = {
  extends: ["next", "turbo", "prettier"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "no-await-in-loop": 2,
    "no-unused-vars": 2,
    "no-undef": 2,
    "no-throw-literal": 2,
    "prefer-const": 1,
    "no-implicit-coercion": 2,
  },
};
