import express from 'express';
import path from 'path';
import debug0 from "debug";
import indexRouter from "./routes";
import usersRouter from "./routes/users";
import cookieParser from "cookie-parser";
import logger from "morgan";
import {notFound} from "./middlewares/not-found";

const debug = debug0('Chat-API:server');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname,"..","/public")));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(notFound)


const port = process.env.PORT || '3000';
const start_server = () => {
    try {
        app.listen(port, () => {
            console.log(`The server is listening on http://localhost:${port}`)
        })
    } catch (e) {
        console.error("Error launching the server: ", e);
        process.exit(1)
    }
}

start_server()