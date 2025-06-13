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

/**
 * @swagger
 * /people/points:
 *   get:
 *     summary: Retrieve point transactions, optionally filtered by person_id
 *     parameters:
 *       - in: query
 *         name: person_id
 *         schema:
 *           type: integer
 *         description: The ID of the person to filter point transactions
 *     responses:
 *       200:
 *         description: A list of point transactions
 */

router.get("/people/points", async (req, res) => {
	const { person_id } = req.query;
	let query = req.app.locals.db("PointTransactions").select("*");

	if (person_id) {
		query = query.where("person_id", person_id);
		logger.info(`Filtering by person_id: ${person_id}`);
	}

	logger.info(`Executing query: ${query.toString()}`);
	const transactions = await query;
	logger.info(`Query results: ${JSON.stringify(transactions)}`);
	res.json(transactions);
});

/**
 * @swagger
 * /people/points/totals:
 *   get:
 *     summary: Retrieve total points grouped by person_id, optionally filtered by person_id
 *     parameters:
 *       - in: query
 *         name: person_id
 *         schema:
 *           type: integer
 *         description: The ID of the person to filter total points
 *     responses:
 *       200:
 *         description: A list of total points grouped by person_id
 */

router.get("/people/points/totals", async (req, res) => {
	const { person_id } = req.query;
	let query = req.app.locals
		.db("PointTransactions")
		.select("person_id")
		.sum({ total_points: "points" })
		.groupBy("person_id");

	if (person_id) {
		query = query.where("person_id", person_id);
		logger.info(`Filtering totals by person_id: ${person_id}`);
	}

	logger.info(`Executing query: ${query.toString()}`);
	const totals = await query;
	const convertedTotals = totals.map((row) => ({
		person_id: row.person_id,
		total_points: parseInt(row.total_points, 10),
	}));
	logger.info(`Query results: ${JSON.stringify(convertedTotals)}`);
	res.json(convertedTotals);
});

export default router;
