/* global process */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./api.js";
// Import and configure the database connection
import knex from "knex";
import knexConfig from "../../knexfile.cjs";
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Explicitly use the 'development' configuration from knexfile.cjs
const db = knex(knexConfig.development);
app.locals.db = db;

// Add middleware to parse JSON requests
app.use(express.json());

// Ensure API routes are handled before static files and catch-all route
app.use("/api", apiRoutes);

const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  // Proxy requests to Vite during development
  app.use(
    createProxyMiddleware({
      target: 'http://localhost:5173',
      changeOrigin: true,
    })
  );
} else {
  // Serve static files from the public directory in production
  app.use(express.static(path.join(__dirname, '../../public')));
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });
}

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
