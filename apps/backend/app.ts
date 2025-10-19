import express from "express";
import http from 'http';
import { Server } from 'socket.io';
import { config } from '../../config.js';
import { connectDB } from './db.js';
import { errorHandler } from "./src/middlewares/errorHandler.js"
import cors from 'cors';
import authRouter from './src/routes/auth.router.js';

const PORT = config.PORT;

connectDB();
const app = express();
app.use(express.json());
// Enable CORS for web and Expo clients
app.use(cors({ origin: '*', credentials: false }));

// Register API routes
app.use('/api/auth', authRouter);

// Register your routes here
// e.g. app.use('/api/users', userRoutes);

app.use(errorHandler);

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
