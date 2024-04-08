import express, { NextFunction, Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';

import cors from 'cors';
import passport from 'passport';
import { config } from 'dotenv'; config();
import { connectDb } from './Config/database';
import indexRoutes from './Routes';
import errorHandler from './Middlewares/errorHandler';
import passportConfig from './Config/passport';
import SocketServer from './socket/socketServer';
import SocketManager from './socket/socketManager';
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
        ],
        methods: ["GET", "POST"]
    },
});

connectDb();

passportConfig(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

io.on('connection', (socket: Socket) => {
    console.log('Socket connected', socket.id);
    SocketServer(socket, io);
    SocketManager.getInstance().setIO(io, socket);
});

app.use(indexRoutes);

app.use(errorHandler);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});