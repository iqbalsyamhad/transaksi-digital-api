import express, { Express, Request, Response } from 'express';
import expressServer from './server';
import dotenv from 'dotenv';
import http from 'http';

dotenv.config();

const port = process.env.PORT || 3000;
let app = new expressServer().expressInstance;

const server = http.createServer(app);

server.listen(port);
server.on('listening', onListening);

function onListening(): void {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `Listetning on port ${addr?.port}`;
    console.log(bind);
}