# Starter-React-Component

Publishing React Component is not so easy task as just writing a React Component. This tool will help you to create a React component which has the npm publishing feature.

## Usage

1. Create directory for new npm module

```
mkdir [my-new-npm-module] && cd [my-new-npm-module] 
```

Notice: This name is used for your module name on npm. Your module will be installed as `npm install your-new-react-component`. npm allows only lowercase.

2. Generate new project

```
npx starter-react-component init [MyNewReactComponent]
```

Notice: Following libraries are used in new project.

  - TypeScript
  - Webpack
  - Babel
  - ESLint
  - Jest
  - etc.

## How to publish my React Component to npm

1. Add your name to the `auther` key of the generated `package.json`.

2. Develop your component under the `./src`

3. Publish it.

```
npm login
npm publish
```

`my-new-npm-module` will be published on npm.

## How to use the published React Component

```
import { MyNewReactComponent } from "MyNewReactComponent";

const App = () => (
  <div>
    <MyNewReactComponent />
  </div>
)
```

## Other commands

```
npm start       // Display your React Component in a demo page
npm test        // Run test
npm run lint    // Run ESLint
```

## License

- MIT
