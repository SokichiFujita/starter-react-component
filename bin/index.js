#!/usr/bin/env node

const util = require('util');
const exec = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

const dirs = [
  './src',
  './lib',
  './demo',
  './__tests__'
]

const npms = [
  //Babel
  'npm install --save-dev babel-cli',
  'npm install --save-dev babel-preset-es2015',
  'npm install --save-dev babel-preset-react',
  'npm install --save-dev babel-preset-stage-0',
  
  //React.js
  'npm install --save react',
  'npm install --save react-dom',
  'npm install --save-dev react-addons-css-transition-group',
  'npm install --save-dev react-addons-test-utils',
  'npm install --save-dev react-addons-perf',

  //Jest
  'npm install --save-dev jest-cli',
  'npm install --save-dev babel-jest',
  'npm install --save-dev babel-polyfill',

  //WebPack
  'npm install --save-dev webpack',
  'npm install --save-dev webpack-dev-server',
  'npm install --save-dev babel-loader',

  //ESLint
  'npm install --save-dev eslint',
  'npm install --save-dev eslint-plugin-import',
  'npm install --save-dev eslint-plugin-react',
  'npm install --save-dev eslint-plugin-jsx-a11y',
  'npm install --save-dev eslint-config-airbnb'
]

const repository = {
  "type":"git", 
  "url":"https://example.com"
};

const jest = {
  "unmockedModulePathPatterns": [
    "<rootDir>/node_modules/react",
    "<rootDir>/node_modules/react-dom",
    "<rootDir>/node_modules/react-addons-test-utils"
  ]
};

const scripts = {
  "start": "webpack-dev-server -d --config webpack.demo.config.js --progress --colors --display-error-details",
  "build-demo": "NODE_ENV=production node_modules/.bin/webpack -p --config webpack.demo.config.js --progress --colors --display-error-details",
  "build-component": "NODE_ENV=production node_modules/.bin/webpack -p --progress --colors --display-error-details",
  "build": "npm run build-demo && npm run build-component",
  "test": "BABEL_JEST_STAGE=0 jest",
  "lint": "eslint src/**"
};

const eslint = {
  "extends": "airbnb",
  "plugins": [
      "react"
  ]
}

const keywords = {
  "keywords": [
    "react",
    "reactjs",
    "react-component"
  ]
}

main();

function main() {
  console.log('*** starter-react-component ***');
  const args = process.argv;
  switch (args.length) {
    case 4:
      if (args[2] == 'init') {
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
  console.log('Usage:');
  console.log('starter-react-component init : Setup a React component');
  process.exit(-1);
}

function showComplete() {
  console.log('Completed!');
}

function setupReact(arg) {
  createDirectories(dirs);
  exec('npm init -y', puts);
  fixJSON('package.json', 'description', 'A React Component.');
  fixJSON('package.json', 'repository', repository);
  fixJSON('package.json', 'jest', jest); 
  fixJSON('package.json', 'scripts', scripts); 
  fixJSON('package.json', 'keywords', keywords); 
  fixJSON('package.json', 'license', 'MIT'); 
  createJSON('.eslintrc', eslint);
  createJSON('.babelrc', {"presets":["react", "es2015", "stage-0"]});
  generateWebpackConfig(arg);
  generateWebpackDemoConfig(arg);
  generateComponentFile(arg);
  generateDemoHtml(arg);
  generateDemoJS(arg);
  generateComponentTestFiles();
  npmInstall(npms);
}

function generateWebpackConfig(name) { 
const code =
`const webpack = require('webpack');

const config = {
  entry: {
    ${name}: ["./src/${name}.js"]
  },
  output: {
    path: __dirname + '/lib',
    filename: "[name].js",
    libraryTarget: "umd",
    library: "${name}",
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
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        presets: ["es2015","react","stage-0"]
      }
    }]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ],
};

module.exports = config;
`;
  createFile(`webpack.config.js`, code);
}

function generateWebpackDemoConfig(name) { 
const code =
`const webpack = require('webpack');

const config = {
  devtool: "inline-source-map",
  entry: {
    ${name}Demo: ["./src/${name}Demo.js"]
  },
  output: {
    path: __dirname + '/demo',
    filename: "[name].js",
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: "babel",
      query: {
        presets: ["es2015","react","stage-0"]
      }
    }]
  },
  devServer: {
    contentBase: "./demo",
    colors: true,
    historyApiFallback: true,
    inline: true
  },

}

if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ];
};

module.exports = config;
`;
  createFile(`webpack.demo.config.js`, code);
}

function generateDemoHtml(name) {
  const code =

`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Title</title>
  </head>
  <body>
    <div id='root'></div>
    <script src="./${name}Demo.js"></script>
  </body>
</html>
`;

  createFile(`./demo/index.html`, code);
}

function generateDemoJS(name) {
  const code =
`import React, { Component } from 'react';
import { render } from 'react-dom';
import ${name} from './${name}';

class ${name}Demo extends Component {

  render() {
    return (
      <div>
        <h1>React Component Demo</h1>
        <${name} title="World">
          <span>This is a react component.</span>
        </${name}>
      </div>
    );
  }
}

render(<${name}Demo />, document.getElementById('root'));
`;

  createFile(`./src/${name}Demo.js`, code);
}

function generateComponentFile(name) {
  const code =
`import React, { Component, PropTypes } from 'react';

class ${name} extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired
  }

  state = {
  }

  handleClick = (event) => {
    console.log(event);
  }

  render() {
    return (
      <div>
        <h1>Hello</h1>
        <h2>{this.props.title}</h2>
        {this.props.children}
      </div>
    );
  }
}

export default ${name};
`;
  
  createFile(`./src/${name}.js`, code);
}

function generateComponentTestFiles() {
  const basePath = './src';
  const components = getFileNames(basePath);
  for (const i in components) {
    const component = path.parse(components[i]).name;
    const testFile = './__tests__/' + component + '-test.js';
    createFile(testFile, generateComponentTestCode(component));
  }
}

function generateComponentTestCode(module) {
  const testCode = 
`jest.unmock('../src/${module}');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import ${module} from '../src/${module}'

describe('<${module} />', () => {
  it('', () => {
    const renderer = TestUtils.createRenderer();
    renderer.render(
      <${module} />
    );
    const dom = renderer.getRenderOutput();
    //expect(dom.props.//PROPS_NAME).toEqual('//TEXT');
  });
});
`
  return testCode;
}

function getFileNames(dir) {
  if (fs.existsSync(dir)) { 
    return fs.readdirSync(dir);
  }
  return [];
}

function createDirectories(dirs) {
  dirs.map(function(dir) {
    if (!fs.existsSync(dir)) { 
      fs.mkdirSync(dir); 
      console.log('Create:', dir);
    }
  })
}

function npmInstall(npms) {
  npms.map(command => {
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
    console.log('Create:', file);
  }
}

function createJSON(file, json) {
  if (!fs.existsSync(file)) { 
    fs.writeFileSync(file, JSON.stringify(json, null, "  "));
    console.log('Create:', file);
  }
}

function fixJSON(file, key, value) {
  var json = JSON.parse(fs.readFileSync(file));
  json[key] = value;
  fs.writeFileSync(file, JSON.stringify(json, null, "  "));
  console.log('Fix:', file, 'Key:', key);
}

