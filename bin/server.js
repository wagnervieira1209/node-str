'use strict'

// IMPORTANDO OS PACOTES
const app = require('../src/app')
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');

const port = normalizePort(process.env.PORT || '3000'); // setando porta
app.set('port', port);

// Criando Servidor
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('API rodando na porta ' + port);

function normalizePort(val)
{
    const port = parseInt(val);

    if (isNaN(port))
    {
        return val;
    }

    if (port > 0)
    {
        return port;
    }

    return false;
}

// error handler
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);

    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);

    default:
      throw error;
  }
}

// listener handler
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}