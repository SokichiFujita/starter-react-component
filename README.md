# starter-react-component

A React component generator to publish to npm.

- Generate a React component project which includes the following configuration.
  - webpack for the React component component and its demo.
  - `.npmignore` to publish the component to npm
  - `.babelrc` for ES6(ES2015), ES7
  - `.eslintrc` with Airbnb-style-guide
- Build the React component.
- Build a demo for the React component.
- Publish it to NPM.

## Installation

```
npm install -g starter-react-component
```

## Usage

```
starter-react-component init
```

## NPM commands for a generated React component

```
npm start       // Display React component's demo
npm publish     // Build React component and publish to npm
npm test        // Run test by Jest
npm run lint    // Run ESLint with Airbnb-Style-Guide
```

## License

- MIT

