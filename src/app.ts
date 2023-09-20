import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { router as organizationCreationRouter } from './routes/organizationCreationRoutes';
import { router as organizationRouter } from './routes/organizationRoutes';
import { router as userRouter } from './routes/userRoutes';
import { userAuth } from './services/middleware/userAuth';
import { orgUserAuth } from './services/middleware/orgUserAuth';
import cors from 'cors';
import { networkInterfaces } from "os"

const app = express();
const port = 3000;

const env = process.env.NODE_ENV || 'development';
console.log(`Env:: ${env}`)

console.log("Testing api...")

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

console.log(results)

const allowedOrigins = ['http://localhost:5173'];
const options: cors.CorsOptions = {
  credentials: true,
  origin: allowedOrigins
};

app.use(cors(options));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/organization', organizationCreationRouter); //public
app.use(
  '/api/v1/organization/:organizationId',
  userAuth,
  orgUserAuth,
  organizationRouter
); // all org-specific resource access/modification lives here

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
