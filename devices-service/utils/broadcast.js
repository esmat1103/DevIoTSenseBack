function broadcast(wss, data) {
    if (wss && wss.clients) {
      wss.clients.forEach(client => {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify(data));
        }
      });
    }
  }
  
  module.exports = broadcast;
  