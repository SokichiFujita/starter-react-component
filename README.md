# Starter-React-Component

Publishing React Component is not so easy task as just writing a React Component. This tool will help you to create a React component which has the npm publishing feature.

## Usage

1. Create directory for new component

```
mkdir [YourNewReactComponent] && cd [YourNewReactComponent] 
```

2. Generate new project

```
npx starter-react-component init [YourNewReactComponent]
```

Notice: Following tools are used in new project 

  - TypeScript
  - Webpack & Webpack dev server
  - Babel
  - ESLint
  - Jest
  - etc.

## How to publish my React Component to npm

1. Configure the generated `package.json`. (e.g. Add your name to the `auther`)

2. Just publish it.

```
npm login
npm publish
```

## Other commands

```
npm start       // Display your React Component in a demo page
npm test        // Run test
npm run lint    // Run ESLint
```

## License

- MIT
