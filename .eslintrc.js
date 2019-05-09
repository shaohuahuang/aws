exports = {
  "root": true,
  "parser": "babel-eslint",
  "env": {
    "node": true
  },
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended",
    "prettier",
    "prettier/flowtype"
  ],
  "plugins": [
    "import",
    "flowtype",
    "flowtype-errors",
    "prettier"
  ],
  "rules": {
    "no-undef": "off",
    "no-console": "off",
    "valid-jsdoc": [
      "error",
      {
        "prefer": {
          "arg": "param",
          "return": " returns"
        },
        "requireReturnType": false,
        "requireReturn": false
      }
    ],
    "no-use-before-define": "off",
    "no-shadow": "off",
    "import/prefer-default-export": "off",
    "no-param-reassign": ["error", { "props": false }],
    "no-underscore-dangle": ["warn", { "allow": ["_id", "_rev", "_path"] }],
    "handle-callback-err": "error",
    "no-unused-vars": ["error", { "vars": "local", "args": "none" }],
    "no-unused-expressions": ["error", { "allowTernary": true }],
    "no-plusplus": ["off", { "allowForLoopAfterthoughts": true }],
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
    "jsx-a11y/no-static-element-interactions": "off",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/prop-types": "off",
    "react/no-unused-prop-types": "warn",
    "prettier/prettier": ["error", { "tabWidth": 4, "semi": false, "parser": "flow" }],
    "flowtype-errors/show-errors": 2,
    "no-case-declarations": "off"
  }
}
