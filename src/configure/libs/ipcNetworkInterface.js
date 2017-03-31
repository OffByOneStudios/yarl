



if(YARL_BROWSER) {
  const {ipcRenderer} = require('electron')
  export default function() {
    return {

      query(request) {
        return new Promise((resolve, reject) => {
          date = new Date();
          ipcRenderer.once(date.getTime().toString(), (e, ...args) => {
            resolve(args)
          });
          ipcRenderer.send("/graphql", date.getTime().toString(), request);
        });
      }
    }
  }
}

else {
  const {ipcMain} = require('electron')
  export default function() {
    ipcMain.on('/graphql', (event, token, request) => {
      const response = {
        data: {},
        error: "GraphQL over IPC isn't actually implemented"
      }
      event.sender.send(token, response)
    })
  }
}
