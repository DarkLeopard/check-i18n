module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "ignorePatterns": [
    "node_modules",
    "dist",
    "coverage",
    "**/polyfills.ts",
    "**/test.ts"
  ],
  "parserOptions": {
    "project": "./tsconfig.json",
    "tsconfigRootDir": __dirname,
    "sourceType": "module"
  },
  "plugins": [
    "eslint-plugin-import",
    "eslint-plugin-unicorn",
    "@typescript-eslint",
    "@angular-eslint/eslint-plugin",
    "@nrwl/nx"
  ],
  "extends": [
  ],
  "rules": {
    "no-restricted-imports": [
      "warn",
      {
        "patterns": [
          "@wl/legacy-shared/*"
        ]
      }
    ],
    "@nrwl/nx/enforce-module-boundaries": [
      "warn",
      {
        "allow": [],
        "depConstraints": [
        ]
      }
    ],
    "array-bracket-spacing": "error",
    "object-curly-spacing": [
      "error",
      "never"
    ],
    "space-in-parens": [
      "error",
      "never"
    ],
    "space-infix-ops": "error",
    "curly": "error",
    "max-lines": [
      "error",
      800
    ],
    "no-cond-assign": "error",
    "no-console": [
      "error",
      {
        "allow": [
          "debug",
          "info",
          "dirxml",
          "warn",
          "error",
          "dir",
          "time",
          "timeEnd",
          "timeLog",
          "trace",
          "assert",
          "clear",
          "count",
          "countReset",
          "group",
          "groupCollapsed",
          "groupEnd",
          "table",
          "Console",
          "markTimeline",
          "profile",
          "profileEnd",
          "timeline",
          "timelineEnd",
          "timeStamp",
          "context"
        ]
      }
    ],
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-new-wrappers": "error",
    "no-redeclare": "error",
    "no-template-curly-in-string": "error",
    "no-var": "error",
    "prefer-template": "error",
    "eqeqeq": [
      "error",
      "always"
    ],
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "comma-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "spaced-comment": [
      "error",
      "always",
      {
        "markers": [
          "/"
        ]
      }
    ],
    "use-isnan": "error",
    "valid-typeof": "error",
    "yoda": "error",
    "no-empty-function": [
      "error",
      {
        "allow": [
          "constructors"
        ]
      }
    ],
    "no-dupe-else-if": "error",
    "no-empty": "error",
    "no-extra-semi": "error",
    "default-case-last": "error",
    "grouped-accessor-pairs": "error",
    "no-empty-pattern": "error",
    "no-extra-bind": "error",
    "no-eval": "error",
    "no-multi-str": "error",
    "no-self-compare": "error",
    "brace-style": "error",
    "eol-last": [
      "error",
      "always"
    ],
    "function-call-argument-newline": [
      "error",
      "consistent"
    ],
    "max-depth": [
      "error",
      3
    ],
    "no-lonely-if": "error",
    "no-multiple-empty-lines": [
      "error",
      {
        "max": 1,
        "maxBOF": 0,
        "maxEOF": 0
      }
    ],
    "no-unneeded-ternary": "error",
    "no-trailing-spaces": "error",
    "no-whitespace-before-property": "error",
    "semi-spacing": [
      "error",
      {
        "before": false,
        "after": true
      }
    ],
    "operator-linebreak": [
      "error",
      "before"
    ],
    "arrow-spacing": "error",
    "arrow-parens": [
      "error",
      "always"
    ],
    "no-const-assign": "error",
    "no-this-before-super": "error",
    "prefer-const": "error",
    "prefer-rest-params": "error",
    "sort-imports": [
      "error",
      {
        "ignoreCase": true,
        "ignoreDeclarationSort": true
      }
    ],
    "no-caller": "error",
    "no-constant-condition": "error",
    "no-fallthrough": "error",
    "no-irregular-whitespace": "error",
    "no-throw-literal": "error",
    "no-unused-labels": "error",
    "radix": "error",
    "import/no-extraneous-dependencies": "error",
    "import/no-deprecated": "error",
    /* typescript-eslint */
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/quotes": [
      "error",
      "single"
    ],
    "@typescript-eslint/semi": [
      "error"
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "semi",
          "requireLast": true
        },
        "singleline": {
          "delimiter": "semi",
          "requireLast": false
        }
      }
    ],
    "@typescript-eslint/no-empty-interface": "error",
    "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
    "@typescript-eslint/require-await": "error",
    "@typescript-eslint/no-useless-constructor": "error",
    "@typescript-eslint/no-namespace": "error",
    "@typescript-eslint/no-require-imports": "error",
    "@typescript-eslint/no-this-alias": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/consistent-type-definitions": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/unified-signatures": "error",
    /* @angular-eslint */
    "@angular-eslint/component-class-suffix": "error",
    "@angular-eslint/contextual-lifecycle": "error",
    "@angular-eslint/directive-class-suffix": "error",
    "@angular-eslint/no-conflicting-lifecycle": "error",
    "@angular-eslint/no-lifecycle-call": "error",
    "@angular-eslint/use-lifecycle-interface": "error",
    "@angular-eslint/relative-url-prefix": "error",
    "@angular-eslint/use-component-selector": "error",
    "@angular-eslint/use-component-view-encapsulation": "error",
    "@angular-eslint/use-pipe-decorator": "error",
    "@angular-eslint/use-pipe-transform-interface": "error",
    "@angular-eslint/no-host-metadata-property": "error",
    "@angular-eslint/no-inputs-metadata-property": "error",
    "@angular-eslint/no-outputs-metadata-property": "error",
    "@angular-eslint/no-queries-metadata-property": "error",
    "@angular-eslint/component-max-inline-declarations": [
      "error",
      {
        "template": 5,
        "styles": 10,
        "animations": 20
      }
    ],
    "@angular-eslint/component-selector": [
      "error",
      {
        "type": "element",
        "prefix": "wl",
        "style": "kebab-case"
      }
    ],
    "@angular-eslint/directive-selector": [
      "error",
      {
        "type": "attribute",
        "prefix": "wl",
        "style": "camelCase"
      }
    ],
    /* warning*/
    "dot-notation": "warn",
    "max-len": [
      "warn",
      120
    ],
    "id-denylist": [
      "error",
      "any",
      "Number",
      "number",
      "String",
      "string",
      "Boolean",
      "boolean",
      "Undefined",
      "undefined",
      "cb",
      "callback"
    ],
    "id-length": [
      "warn",
      {
        "min": 2,
        "exceptions": [
          "i",
          "_"
        ]
      }
    ],
    "max-classes-per-file": [
      "error",
      3
    ],
    "no-param-reassign": "error",
    "no-restricted-globals": [
      "error",
      "event",
      "window",
      "document",
      "location",
      "localStorage",
      "sessionStorage"
    ],
    "unicorn/filename-case": "error",
    /* @typescript-eslint */
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        "allowExpressions": true
      }
    ],
    "@typescript-eslint/explicit-member-accessibility": [
      "warn",
      {
        "accessibility": "explicit",
        "overrides": {
          "accessors": "explicit",
          "constructors": "no-public",
          "methods": "explicit",
          "properties": "explicit",
          "parameterProperties": "explicit"
        }
      }
    ],
    "@typescript-eslint/typedef": [
      "warn",
      {
        "arrayDestructuring": false,
        "objectDestructuring": false,
        "arrowParameter": true,
        "parameter": true,
        "memberVariableDeclaration": true,
        "propertyDeclaration": true,
        "variableDeclaration": true,
        "variableDeclarationIgnoreFunction": true
      }
    ],
    "@typescript-eslint/naming-convention": [
      "error",
      // types
      {
        "selector": "typeLike",
        "format": [
          "PascalCase"
        ]
      },
      {
        "selector": "interface",
        "format": [
          "StrictPascalCase"
        ],
        "prefix": [
          "I"
        ]
      },
      {
        "selector": "enum",
        "format": [
          "StrictPascalCase"
        ],
        "suffix": [
          "Enum"
        ]
      },
      {
        "selector": "typeAlias",
        "format": [
          "StrictPascalCase"
        ],
        "suffix": [
          "Type"
        ]
      },
      // variables
      {
        "selector": "variableLike",
        "format": [
          "camelCase"
        ]
      },
      {
        "selector": "variable",
        "modifiers": [
          "const"
        ],
        "format": [
          "camelCase",
          "UPPER_CASE"
        ]
      },
      // properties
      {
        "selector": "property",
        "format": [
          "camelCase"
        ],
        "leadingUnderscore": "allow"
      },
      {
        "selector": "enumMember",
        "format": [
          "PascalCase"
        ]
      },
      // all other
      {
        "selector": "default",
        "format": [
          "strictCamelCase"
        ]
      }
    ],
    /* @angular-eslint */
    "@angular-eslint/prefer-on-push-component-change-detection": "warn",
    "@angular-eslint/no-input-rename": "error",
    "@angular-eslint/no-output-rename": "error",
    "@angular-eslint/no-forward-ref": "warn",
    "@angular-eslint/no-output-native": "warn",
    "@angular-eslint/no-output-on-prefix": "warn"
  },
  "overrides": [
    {
      "files": [
        "*.actions.ts"
      ],
      "rules": {
        "max-classes-per-file": [
          "off"
        ],
        "@typescript-eslint/no-namespace": "off"
      }
    },
    {
      "files": [
        "*.spec.ts"
      ],
      "rules": {
        "no-empty-function": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@angular-eslint/no-lifecycle-call": "off"
      }
    },
    {
      "files": [
        "*.dto.ts",
        "*.converter.ts",
        "*.spec.ts"
      ],
      "rules": {
        "@typescript-eslint/naming-convention": [
          "error",
          // types
          {
            "selector": "typeLike",
            "format": [
              "StrictPascalCase"
            ]
          },
          {
            "selector": "interface",
            "format": [
              "StrictPascalCase"
            ],
            "prefix": [
              "I"
            ]
          },
          {
            "selector": "enum",
            "format": [
              "StrictPascalCase"
            ],
            "suffix": [
              "Enum"
            ]
          },
          {
            "selector": "typeAlias",
            "format": [
              "StrictPascalCase"
            ],
            "suffix": [
              "Type"
            ]
          },
          // variables
          {
            "selector": "variableLike",
            "format": [
              "camelCase"
            ]
          },
          {
            "selector": "variable",
            "modifiers": [
              "const"
            ],
            "format": [
              "camelCase",
              "UPPER_CASE"
            ]
          },
          // properties
          {
            "selector": "property",
            "format": [
              "camelCase",
              "UPPER_CASE",
              "snake_case",
              "StrictPascalCase"
            ],
            "leadingUnderscore": "allow"
          },
          {
            "selector": "enumMember",
            "format": [
              "PascalCase"
            ]
          },
          // all other
          {
            "selector": "default",
            "format": [
              "strictCamelCase"
            ]
          }
        ]
      }
    }
  ]
}
