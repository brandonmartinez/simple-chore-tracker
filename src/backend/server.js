/* global process */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./api/index.js";
// Import and configure the database connection
import knex from "knex";
import knexConfig from "../../knexfile.cjs";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

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

const isDevelopment = process.env.NODE_ENV === "development";

if (isDevelopment) {
	// Swagger should only be enabled in development mode
	const swaggerOptions = {
		swaggerDefinition: {
			openapi: "3.0.0",
			info: {
				title: "Simple Chore Tracker API",
				version: "1.0.0",
				description:
					"API documentation for the Simple Chore Tracker application",
			},
			servers: [
				{
					url: `http://localhost:${PORT}/api`,
					description: "Development server",
				},
			],
		},
		apis: ["./src/backend/api/**/*.js"],
	};

	const swaggerDocs = swaggerJsDoc(swaggerOptions);
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
	// Proxy requests to Vite during development, including WebSocket connections
	app.use(
		createProxyMiddleware({
			target: "http://localhost:5173",
			changeOrigin: true,
			ws: true, // Enable WebSocket proxying
		})
	);
} else {
	// Serve static files from the public directory in production
	app.use(express.static(path.join(__dirname, "../../public")));
	app.get(/^\/(?!api).*/, (req, res) => {
		res.sendFile(path.join(__dirname, "../../public/index.html"));
	});
}

app.listen(PORT, () =>
	console.log(`Server running on http://localhost:${PORT}`)
);
