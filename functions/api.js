import express from 'express';
import serverless from 'serverless-http';
import { routes } from './utils/routes.js';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(cors())

console.log("Rotas antes do forEach:", routes);

routes.forEach(route => {
    const fullPath = `/.netlify/functions/api${route.path}`;
    console.log("Registrando rota:", route.method, fullPath);
    app[route.method.toLowerCase()](fullPath, route.handler);
});

console.log("Rotas após registro (app._router.stack):", app._router?.stack);

export const handler = serverless(app);