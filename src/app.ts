import express from 'express';
import path from 'path';
import debug0 from "debug";
import indexRouter from "./routes";
import contactsRouter from "./routes/contact"
import usersRouter from "./routes/users";
import cookieParser from "cookie-parser";
import logger from "morgan";
import {configDotenv} from "dotenv";
import cors from "cors";
import {notFound} from "./middlewares/not-found";
import { PrismaClient } from '@prisma/client';

const debug = debug0('Chat-API:server');
const app = express();
const prisma = new PrismaClient()




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: '*'}))
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname,"..","/public")));

app.use('/index', indexRouter);
app.use('/',contactsRouter)
app.use('/', usersRouter);

app.use(notFound)


const port = process.env.PORT || '3000';
const start_server = async() => {
    try {
        await prisma.$connect();
        app.listen(port, () => {
            console.log(`The server is listening on http://localhost:${port}`)
        })
    } catch (e) {
        console.error("Error launching the server: ", e);
        process.exit(1)
    }
}

start_server()