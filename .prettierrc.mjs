const config = {
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  insertPragma: false,
  bracketSameLine: false,
  jsxSingleQuote: false,
  printWidth: 100,
  proseWrap: "preserve",
  quoteProps: "as-needed",
  requirePragma: false,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  useTabs: false,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: [
    "^react$",
    "^@mui",
    "^recoil$",
    "<THIRD_PARTY_MODULES>",
    "^@app/storybook",
    "^components/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};

//module.exports = config;
export default config;
