import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
console.log(AppContainer);
function render() {
  ReactDOM.render((
  <AppContainer>
    <div>FFFF</div>
  </AppContainer>
), document.getElementById('react-root'));
}
render();

if (module.hot) {
  module.hot.accept('./', render)
  module.hot.accept('./modules', render);
}
