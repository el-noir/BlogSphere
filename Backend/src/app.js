import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(express.json({
    limit: '16kb',
}));

app.use(express.urlencoded({
    extended: true,
    limit: '16kb',
}));

app.use(express.static("public"));

app.use(cookieParser());

app.use('/api/v1/users', userRouter);

export { app };
