
import * as http from 'http';
import * as SocketIO from 'socket.io';

const fs = require('fs');
const path = require('path');




export class GameServer {

  app:http.Server;
  io:SocketIO.Server;

  constructor() {
    // console.log(SocketIO);
  }

  start() {
    const port = 8088;

    this.app = http.createServer(this.handler);

// @ts-ignore
    this.io = SocketIO.default(this.app);

    this.app.listen(port);

    this.io.on('connection', this.onSocket);
    console.log(`port opened: ${port}`);

  }

  private handler = (req:http.IncomingMessage, res:http.ServerResponse) => {};


  private onSocket = (socket:SocketIO.Socket):void => {
    console.log('soc connect');
    socket.on('c2s', (data:any)=>{
      console.log(data);

      socket.emit('s2c', {p:20, msg:'received'});

    });
  };



}

