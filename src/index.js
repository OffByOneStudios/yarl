import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

function render() {
  ReactDOM.render((
  <AppContainer>
    <div style={{display: 'flex'}}>
      <iframe style={{height: "100%", flex: 1}} src="https://gingkoapp.com/" />
    </div>

  </AppContainer>
), document.getElementById('react-root'));
}
render();

if (module.hot) {
  module.hot.accept('./', render)
  // module.hot.accept('./modules', render);
}
