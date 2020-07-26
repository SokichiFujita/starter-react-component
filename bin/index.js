#!/usr/bin/env node

const exec = require("child_process").execSync;

const util = require("util");
const fs = require("fs");
const path = require("path");

const dirs = ["./src", "./lib", "./demo", "./__tests__"];

const npms = [
  //Babel
  "npm install -D @babel/cli",
  "npm install -D @babel/core",
  "npm install -D @babel/preset-env",
  "npm install -D @babel/preset-react",

  //Polyfill
  `npm install @babel/runtime`,
  `npm install -D @babel/plugin-transform-runtime`,

  //React.js
  "npm install react",
  "npm install react-dom",
  "npm install prop-types",

  //Jest
  "npm install -D jest-cli",
  "npm install -D babel-jest",
  `npm install -D react-test-renderer`,

  //WebPack
  "npm install -D webpack",
  "npm install -D webpack-cli",
  "npm install -D webpack-dev-server",
  "npm install -D babel-loader",

  "npm install -D webpack-bundle-analyzer",
  `npm install -D webpack-bundle-size-analyzer`,

  //ESLint
  "npm install -D eslint",
  "npm install -D babel-eslint",
  `npm install -D eslint-config-airbnb`,
  `npm install -D eslint-plugin-import`,
  `npm install -D eslint-plugin-react`,
  `npm install -D eslint-plugin-jsx-a11y`,
  `npm install -D eslint-plugin-jest`,
  `npm install -D eslint-plugin-react-hooks`,

  //Prettier
  "npm install -D prettier",
  "npm install -D eslint-plugin-prettier",
  "npm install -D eslint-config-prettier",

  `npm install -D typescript`,
  `npm install -D @types/react`,
  `npm install -D @types/react-dom`,
  `npm install -D @types/react-router-dom`,
  `npm install -D @types/flux`,
  `npm install -D @types/jest`,
  `npm install -D @babel/preset-typescript`,
  `npm install -D @typescript-eslint/parser`,
  `npm install -D @typescript-eslint/eslint-plugin`,
];

const repository = {
  type: "git",
  url: "https://github.com",
};

const jest = {
  unmockedModulePathPatterns: [
    "<rootDir>/node_modules/react",
    "<rootDir>/node_modules/react-dom",
    "<rootDir>/node_modules/react-addons-test-utils",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
};

const scripts = {
  start:
    "webpack-dev-server --config webpack.demo.config.js --progress --mode development",
  "build-demo":
    "webpack -p --config webpack.demo.config.js --progress --mode production",
  "build-component": "webpack -p --progress --mode production",
  build: "npm run build-component && npm run build-demo",
  prepublish: "npm run build",
  test: "BABEL_JEST_STAGE=0 jest",
  lint: "eslint 'src/**/*.{ts,tsx,js}' '__tests__/**/*.{ts,tsx,js}'",
  fix: "eslint 'src/**/*.{ts,tsx,js}' '__tests__/**/*.{ts,tsx,js}' --fix",
};

const eslint = {
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    jest: true,
  },
  plugins: ["prettier", "jest"],
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "react/jsx-filename-extension": [1, { extensions: [".js", ".ts", ".tsx"] }],
    "import/prefer-default-export": "off",
    "react/no-find-dom-node": 0,
    "class-methods-use-this": "off",
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["to", "hrefLeft", "hrefRight"],
        aspects: ["noHref", "invalidHref", "preferButton"],
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
  },
};

const keywords = {
  keywords: ["React", "ReactJS", "TypeScript", "UI"],
};

main();

function main() {
  console.log("*** starter-react-component ***");
  const args = process.argv;
  switch (args.length) {
    case 4:
      if (args[2] == "init") {
        setupReact(args[3]);
        showComplete();
      }
      break;
    default:
      showUsage();
      break;
  }
}

function showUsage() {
  console.log("Usage:");
  console.log(
    "starter-react-component init [component-name]: Generate a React component to publish to npm"
  );
  process.exit(-1);
}

function showComplete() {
  console.log("Completed!");
}

function setupReact(arg) {
  createDirectories(dirs);
  exec("npm init -y", puts);
  fixJSON("package.json", "version", "0.0.1");
  fixJSON(
    "package.json",
    "description",
    "A React Component generated by starter-react-component ( https://www.npmjs.com/package/starter-react-component )."
  );
  fixJSON("package.json", "repository", repository);
  fixJSON("package.json", "jest", jest);
  fixJSON("package.json", "scripts", scripts);
  fixJSON("package.json", "keywords", keywords);
  fixJSON("package.json", "license", "MIT");
  fixJSON("package.json", "main", `./lib/index.js`);
  createJSON(".eslintrc", eslint);
  createJSON(".babelrc", {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env",
        {
          targets: [
            "last 2 Chrome versions",
            "last 2 Safari versions",
            "last 2 Firefox versions",
            "ie 11",
            "cover 85% in US",
          ],
        },
      ],
      "@babel/preset-typescript",
    ],
  });
  generateReadme(arg);
  generateNpmignore();
  generateWebpackConfig(arg);
  generateWebpackDemoConfig(arg);
  generateComponentFile(arg);
  generateIndexJS(arg);
  generateDemoHtml(arg);
  generateDemoJS(arg);
  generateComponentTestFiles();
  npmInstall(npms);
}

function generateReadme(componentName) {
  const moduleName = getJSONValueByKey("package.json", "name");
  const content = `# ${componentName}

## Install

    npm install ${moduleName}

## Usage

    import { ${componentName} } from '${componentName}';

    const ParentComponent = () => (
      <div>
        <${componentName} />
      </div>
    );    
`;

  createFile("README.md", content);
}

function generateNpmignore() {
  const code = `
src/
__tests__/
.eslintrc
.babelrc
webpack.config.js
webpack.demo.config.js
`;
  createFile(".npmignore", code);
}

function generateWebpackConfig(name) {
  const code = `const webpack = require('webpack');
const path = require("path");

const config = {
  entry: {
    index: ["./src/index.ts"]
  },
  output: {
    path: __dirname + '/lib',
    filename: "[name].js",
    libraryTarget: "umd",
    library: "${name}",
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx"]
  },  
  externals: {
   "react": {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    "react-dom": {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    }
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};

module.exports = config;
`;
  createFile(`webpack.config.js`, code);
}

function generateWebpackDemoConfig(name) {
  const code = `const webpack = require('webpack');
const path = require("path");

const config = {
  entry: {
    ${name}Demo: [path.resolve(__dirname, "./src/${name}Demo.tsx")]
  },
  output: {
    path: path.resolve(__dirname, './demo'),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".mjs", ".ts", ".tsx", ".js", ".jsx"]
  },  
  module: {
    rules: [
      {
        test: /.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: "./demo",
    historyApiFallback: true,
    open: true
  },

}

  module.exports = config;
`;
  createFile(`webpack.demo.config.js`, code);
}

function generateIndexJS(name) {
  const code = `
export { default as ${name}} from './${name}';
`;
  createFile(`./src/index.ts`, code);
}

function generateDemoHtml(name) {
  const code = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
  </head>
  <body>
    <div id='root'></div>
    <script src="./bundle.js"></script>
  </body>
</html>
`;
  createFile(`./demo/index.html`, code);
}

function generateDemoJS(name) {
  const code = `import React from 'react';
import { render } from 'react-dom';
import ${name} from './${name}';

const ${name}Demo = () => (
  <div>
    <h1>React Component Demo</h1>
    <${name} title="Hello" />
  </div>
);

render(<${name}Demo />, document.getElementById('root'));
`;
  createFile(`./src/${name}Demo.tsx`, code);
}

function generateComponentFile(name) {
  const code = `import React from 'react';
import PropTypes from 'prop-types'; 

const ${name} = ({ title = "Hello" }) => {
  return (
    <div>
      <h1 className="title">{title}</h1>
      <div>World</div>
    </div>
  );
}

${name}.propTypes = {
  title: PropTypes.string.isRequired
}

export default ${name};
`;
  createFile(`./src/${name}.tsx`, code);
}

function generateComponentTestFiles() {
  const basePath = "./src";
  const components = getFileNames(basePath).filter(
    (x) =>
      !path.parse(x).name.includes("index") &&
      !path.parse(x).name.includes("Demo")
  );
  for (const i in components) {
    const component = path.parse(components[i]).name;
    const testFile = "./__tests__/" + component + "-test.js";
    createFile(testFile, generateComponentTestCode(component));
  }
}

function generateComponentTestCode(module) {
  const testCode = `
import React from 'react';
import renderer from "react-test-renderer";
import ${module} from '../src/${module}'

test('Props is displayed', () => {
  const component = renderer.create(
    <${module} title="Hello" />
  );
  const instance = component.root;
  expect(
    instance.findByProps({ className: "title" }).children
  ).toEqual(
    ["Hello"]
  );
});
`;
  return testCode;
}

function getFileNames(dir) {
  if (fs.existsSync(dir)) {
    return fs.readdirSync(dir);
  }
  return [];
}

function createDirectories(dirs) {
  dirs.map(function (dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      console.log("Create:", dir);
    }
  });
}

function npmInstall(npms) {
  npms.map((command) => {
    console.log(command);
    exec(command, puts);
  });
}

function puts(error, stdout, stderr) {
  util.puts(stdout);
  util.puts(stderr);
  util.puts(error);
}

function createFile(file, content) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
    console.log("Create:", file);
  }
}

function createJSON(file, json) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(json, null, "  "));
    console.log("Create:", file);
  }
}

function fixJSON(file, key, value) {
  var json = JSON.parse(fs.readFileSync(file));
  json[key] = value;
  fs.writeFileSync(file, JSON.stringify(json, null, "  "));
  console.log("Fix:", file, "Key:", key);
}

function getJSONValueByKey(file, key) {
  var json = JSON.parse(fs.readFileSync(file));
  return json[key];
}
