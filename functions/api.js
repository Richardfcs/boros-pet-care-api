import express from 'express';
import serverless from 'serverless-http';
import { routes } from './utils/routes.js';
import cors from 'cors';
// import { Database } from './utils/database.js'; // Remova esta linha, não é mais necessária aqui
import bodyParser from 'body-parser'; // IMPORTANTE! Re-adicione o bodyParser

const app = express();
const router = express.Router();
// const database = new Database(); // Remova esta linha

// Remova a função initializeDatabase e a chamada a ela

app.use(bodyParser.json()); // Re-adicione o bodyParser
app.use(cors())

console.log("Rotas antes do forEach:", routes);

routes.forEach(route => {
    const fullPath = `/.netlify/functions/api${route.path}`;
    console.log("Registrando rota:", route.method, fullPath);
    app[route.method.toLowerCase()](fullPath, route.handler);
});

console.log("Rotas após registro (app._router.stack):", app._router?.stack);

//app.use('/.netlify/functions/api', router); // Remova essa linha

export const handler = serverless(app);