module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    "parser": "@babel/eslint-parser",
    "parserOptions": {
      "ecmaVersion": 2020,
      "sourceType": "module",
      "requireConfigFile": false,
      "babelOptions": {
        "presets": [
          [
            "@babel/preset-env",
            {
              "targets": {
                "node": "current"
              }
            }
          ]
        ]
      }
    },
    "plugins": ["@babel", "vue"],
    "extends": [
      "eslint:recommended",
      "plugin:vue/recommended",
      "plugin:@babel/recommended"
    ],
    // "parser": "@babel/eslint-parser",
    // "parserOptions": {
    //   "parser": "@typescript-eslint/parser",
    //   "extraFileExtensions": [".vue"],
    //   "requireConfigFile": false,
    //   "babelOptions": {
    //     "presets": ["@babel/preset-env"]
    //   }
    // },
    "presets": ["@babel/preset-flow"]
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/multi-word-component-names': 0,
  }
}