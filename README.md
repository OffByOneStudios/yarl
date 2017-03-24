# Yarl: A Decorated React/Redux workflow
Yet Another React Library leverages Javascript decorators to create a delightful
workflow when building native and web apps.


## Features:
* Easily package your Redux actions, React Components, Helper Functions, and static data using decorators for inversion of control. No more nasty entrypoints
* Clear and concise folder structure
* Built in, platform agnostic navigation logic
* Self hosted documentation and testing engine
* Atom tooling integration with [atom-yarl]()


## Bare Usage
As this project and its recommended usage require a number of features that are stage-2 in Babel (Decorators, Spread, async if you enjoy that sort of thing) transpiling is left to your usage project. To avoid that hassle you can check out its sister projects yarl-[view-library]-base


1) Init
```
mkdir your-yarl
cd your-yarl
npm init
mkdir src
touch src/index.js

```
2) Install
```sh
yarn add @offbyonestudios/yarl
```

3) Webpack Configuration
While we leave Webpack to the developer, you can get away with using this project's `.babelrc` `webpack.config.js`, and the dependencies listed in `package.json`

4) Bare Module
5) Entrypoint
src/index.js
```
// Load any external stuff you need.
// import 'grommet/scss/vanilla/index';
// Import This First Before importing your modules or other Yarl content.
import Yarl from 'yarl';

// Then Load Modules.
import modules from './modules';

// Gather your default state
const defaultState = Yarl.extractDefaultState(modules);

// Then Invoke Yarl's Entrypoint
window.Context = Yarl.entrypoint(defaultState);


// These shorthand methods help with dispatching actions from the command line
window.$d = (actionType) => {
  return window.Context.Store.dispatch(actionType);
}
window.$a = (actionName) => {
  return window.Context.Actions[actionName];
}

window.stahp = (e) => {
  e.preventDefault();
  return false;
}
// Finally, Invoke Render
Yarl.render();
```

## Quotes
* *That was almost fun* -Mason Bially (CEO OB1)
* *When will death come?* -Clark Rinker (Creator)
