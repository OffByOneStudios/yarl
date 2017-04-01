


let fn = () =>{console.log("Stubbed Method not available on this platform");}
if(YARL_ELECTRON) {
  if(YARL_BROWSER) {
    const {ipcRenderer} = require('electron')
    fn =  function() {
      return {

        query(request) {
          return new Promise((resolve, reject) => {
            let token = new Date().getTime().toString();
            ipcRenderer.once(token, (e, response) => {
              resolve(response)
            });
            ipcRenderer.send("/graphql", token, request);
          });
        }
      }
    }
  }

  else {
    const {ipcMain} = require('electron')
    fn = function() {
      ipcMain.on('/graphql', (event, token, request) => {
        const response = {
          data: {},
          error: "GraphQL over IPC isn't actually implemented"
        }
        event.sender.send(token, response)
      })
    }
  }
}

export default fn;
