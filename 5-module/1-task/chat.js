class Chat {
  constructor() {
    this.clients = [];
  }

  subscribe(client) {
    this.clients.push(client);
    client.ctx.res.on('close', () => {
      this.clients = this.clients.filter((c) => c !== client);
    });
  }

  send(message) {
    this.clients.forEach((client) => {
      client.ctx.body = message;
      client.resolve();
    });
    this.clients = [];
  }
}

module.exports = Chat;
