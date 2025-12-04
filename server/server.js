require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('redis');
const { createAdapter } = require('@socket.io/redis-adapter');
const { Pool } = require('pg');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// Redis Setup
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Postgres Setup
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://redbull:redbull@localhost:5432/starrush';

const pgPool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

async function initServer() {
  let io;

  // Try to connect to Redis
  try {
    const pubClient = createClient({ url: redisUrl });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    console.log(`Connected to Redis at ${redisUrl.split('@')[1] || 'localhost'}`);

    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      adapter: createAdapter(pubClient, subClient)
    });
  } catch (err) {
    console.log('Could not connect to Redis, falling back to memory adapter.', err.message);
    io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
  }

  // Initialize DB
  try {
    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS racers (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        category VARCHAR(50),
        status VARCHAR(50) DEFAULT 'registered',
        start_time BIGINT,
        finish_time BIGINT,
        duration BIGINT,
        created_at BIGINT
      );
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('Error initializing database:', err);
  }

  // Helper to get all racers
  async function getRacers() {
    try {
      const res = await pgPool.query('SELECT * FROM racers ORDER BY created_at DESC');
      // Map DB columns to camelCase for frontend
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        category: r.category,
        status: r.status,
        startTime: r.start_time ? parseInt(r.start_time) : null,
        finishTime: r.finish_time ? parseInt(r.finish_time) : null,
        duration: r.duration ? parseInt(r.duration) : null,
        createdAt: parseInt(r.created_at)
      }));
    } catch (err) {
      console.error('Error fetching racers:', err);
      return [];
    }
  }

  io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);

    // Send initial data
    const racers = await getRacers();
    socket.emit('init_data', racers);

    // Allow client to request data manually
    socket.on('request_data', async () => {
      const currentRacers = await getRacers();
      socket.emit('init_data', currentRacers);
    });

    // Register new racer
    socket.on('register_racer', async (racer) => {
      const id = crypto.randomUUID();
      const createdAt = Date.now();

      try {
        await pgPool.query(
          'INSERT INTO racers (id, name, email, phone, category, status, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [id, racer.name, racer.email, racer.phone, racer.category, 'registered', createdAt]
        );

        const newRacer = {
          id,
          name: racer.name,
          email: racer.email,
          phone: racer.phone,
          category: racer.category,
          status: 'registered',
          startTime: null,
          finishTime: null,
          duration: null,
          createdAt
        };

        io.emit('racer_updated', newRacer);
        io.emit('racers_list', await getRacers());
      } catch (err) {
        console.error('Error registering racer:', err);
      }
    });

    // Update racer info
    socket.on('update_racer_info', async (updatedInfo) => {
      try {
        await pgPool.query(
          'UPDATE racers SET name = $1, email = $2, phone = $3, category = $4 WHERE id = $5',
          [updatedInfo.name, updatedInfo.email, updatedInfo.phone, updatedInfo.category, updatedInfo.id]
        );

        io.emit('racers_list', await getRacers());
      } catch (err) {
        console.error('Error updating racer:', err);
      }
    });

    // Start race
    socket.on('start_race', async (id) => {
      const startTime = Date.now();
      try {
        await pgPool.query(
          'UPDATE racers SET status = $1, start_time = $2 WHERE id = $3',
          ['running', startTime, id]
        );
        io.emit('racers_list', await getRacers());
      } catch (err) {
        console.error('Error starting race:', err);
      }
    });

    // Finish race
    socket.on('finish_race', async (id) => {
      const finishTime = Date.now();
      try {
        // First get start time to calculate duration
        const res = await pgPool.query('SELECT start_time FROM racers WHERE id = $1', [id]);
        if (res.rows.length > 0) {
          const startTime = parseInt(res.rows[0].start_time);
          const duration = finishTime - startTime;

          await pgPool.query(
            'UPDATE racers SET status = $1, finish_time = $2, duration = $3 WHERE id = $4',
            ['finished', finishTime, duration, id]
          );
          io.emit('racers_list', await getRacers());
        }
      } catch (err) {
        console.error('Error finishing race:', err);
      }
    });

    // Reset start
    socket.on('reset_start', async (id) => {
      try {
        await pgPool.query(
          "UPDATE racers SET status = 'registered', start_time = NULL WHERE id = $1 AND status != 'finished'",
          [id]
        );
        io.emit('racers_list', await getRacers());
      } catch (err) {
        console.error('Error resetting start:', err);
      }
    });

    // ADMIN: Delete Racer
    socket.on('delete_racer', async (id) => {
      try {
        await pgPool.query('DELETE FROM racers WHERE id = $1', [id]);
        io.emit('racers_list', await getRacers());
      } catch (err) {
        console.error('Error deleting racer:', err);
      }
    });

    // ADMIN: Reset Database (Delete All)
    socket.on('reset_database', async () => {
      try {
        await pgPool.query('DELETE FROM racers');
        io.emit('racers_list', []);
      } catch (err) {
        console.error('Error resetting database:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

initServer();
