import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import io from 'socket.io-client';


const socket = io("http://localhost:3000");
socket.on('connect', () => {
  console.log("Connected to express")
});
socket.on('event', (data) => {

});
socket.on('disconnect', () => {

});
socket.emit({foo: "bar"});

function render() {
  ReactDOM.render((
  <AppContainer>
    <div style={{display: 'flex'}}>
      Hello
    </div>
  </AppContainer>
), document.getElementById('react-root'));
}
render();

if (module.hot) {
  module.hot.accept('./', render)
  // module.hot.accept('./modules', render);
}
