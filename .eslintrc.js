/** @type {import("eslint").Linter.Config} */
module.exports = {
    root: true,
    extends: ["eslint:recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    env: {
        browser: true,
        node: true,
        es2022: true,
    },
    ignorePatterns: [
        "node_modules/",
        "dist/",
        ".next/",
        ".turbo/",
    ],
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended",
            ],
            plugins: ["@typescript-eslint"],
        },
    ],
};
