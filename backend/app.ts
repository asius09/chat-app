import express from 'express';
import { config } from './src/config.js';
import { connectDB } from './db.js';
import { Server } from 'socket.io';
import { errorHandler } from '@/middlewares/errorHandler.js';
import http from 'http';

const PORT = config.PORT;

connectDB();
const app = express();
app.use(express.json());

// Register your routes here
// e.g. app.use('/api/users', userRoutes);

// Error handler middleware (should be after all routes)
app.use(errorHandler);

const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
