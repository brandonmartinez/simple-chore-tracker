import express from "express";
const router = express.Router();
import logger from "../logger.js";

/**
 * @swagger
 * /people:
 *   get:
 *     summary: Retrieve a list of people
 *     responses:
 *       200:
 *         description: A list of people
 */

router.get("/people", async (req, res) => {
	const query = req.app.locals.db("People").select("*");
	logger.info(`Executing query: ${query.toString()}`);
	const people = await query;
	logger.info(`Query results: ${JSON.stringify(people)}`);
	res.json(people);
});

/**
 * @swagger
 * /people:
 *   post:
 *     summary: Add a new person
 *     responses:
 *       201:
 *         description: Person added successfully
 */

router.post("/people", async (req, res) => {
	const query = req.app.locals.db("People").insert(req.body);
	logger.info(`Executing query: ${query.toString()}`);
	const [id] = await query;
	logger.info(`Query results: ${JSON.stringify({ id })}`);
	res.json({ id });
});

export default router;
