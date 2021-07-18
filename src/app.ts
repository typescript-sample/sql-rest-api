import {json} from 'body-parser';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import {createContext} from './init';
import {route} from './route';
import {pool} from './services/sql/SqlUserService';

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use(json());

pool.connect().then( () => {
  console.log('Connected successfully to PostgreSQL.');
  http.createServer(app).listen(port, () => {
    console.log('Start server at port ' + port);
  });
  const ctx = createContext();
  route(app, ctx);
})
.catch(e => {
  console.error('Failed to connect to PostgreSQL.', e.message, e.stack);
});
