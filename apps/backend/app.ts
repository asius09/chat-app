import express, { Express } from "express";
import http from 'http';
import { Server } from 'socket.io';
import { config } from '../../config.js';
import { connectDB } from './db.js';
import { errorHandler } from "./src/middlewares/errorHandler.js"
import cors from 'cors';
import authRouter from './src/routes/auth.router.js';
import groupRouter from './src/routes/group.router.js';

const PORT = config.PORT;
const app: Express = express();

connectDB();

app.use(express.json());

// Enable CORS for web and Expo clients
app.use(cors({ origin: '*', credentials: false }));

// Set up middlewares
app.use(errorHandler);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", message: "API is working" });
});

// Register API routes
app.use('/api/auth', authRouter);
app.use('/api/groups', groupRouter);

// Handle 404 (Not Found) for any unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested resource was not found"
  });
});

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
