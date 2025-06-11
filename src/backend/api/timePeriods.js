import express from "express";
const router = express.Router();
import logger from "../logger.js";

/**
 * @swagger
 * /time-periods:
 *   get:
 *     summary: Retrieve a list of time periods
 *     responses:
 *       200:
 *         description: A list of time periods
 */
router.get("/time-periods", async (req, res) => {
	const query = req.app.locals.db("TimePeriods").select("*");
	console.log("Executing query:", query.toString());
	const periods = await query;
	console.log("Query results:", periods);
	res.json(periods);
});

/**
 * @swagger
 * /time-periods:
 *   post:
 *     summary: Add a new time period
 *     responses:
 *       201:
 *         description: Time period added successfully
 */
router.post("/time-periods", async (req, res) => {
	const query = req.app.locals.db("TimePeriods").insert(req.body);
	console.log("Executing query:", query.toString());
	const [id] = await query;
	console.log("Query results:", { id });
	res.json({ id });
});

/**
 * @swagger
 * /time-periods/current:
 *   get:
 *     summary: Retrieve the current time period
 *     responses:
 *       200:
 *         description: Current time period retrieved successfully
 */
router.get("/time-periods/current", async (req, res) => {
	const currentDate = new Date();

	// Calculate the beginning of the week (Sunday)
	const beginningOfWeek = new Date(currentDate);
	beginningOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
	beginningOfWeek.setHours(0, 0, 0, 0);

	// Search for the time period starting from the beginning of the week
	let query = req.app.locals
		.db("TimePeriods")
		.where("start_date", beginningOfWeek)
		.first();
	console.log("Executing query:", query.toString());
	let timePeriod = await query;
	console.log("Query results:", timePeriod);

	// If no time period exists, create a new one
	if (!timePeriod) {
		const insertQuery = req.app.locals.db("TimePeriods").insert({
			start_date: beginningOfWeek,
			end_date: new Date(beginningOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000), // End of the week (Saturday)
			name: `Week of ${beginningOfWeek.toISOString().split("T")[0]}`, // Generate a name based on the start date
		});
		console.log("Executing insert query:", insertQuery.toString());
		const insertResult = await insertQuery;
		console.log("Insert query results:", insertResult);

		const id = insertResult[0]; // Extract the ID from the result

		query = req.app.locals.db("TimePeriods").where("id", id).first();
		console.log("Executing query for new time period:", query.toString());
		timePeriod = await query;
		console.log("Query results for new time period:", timePeriod);
	}

	res.json(timePeriod);
});

/**
 * @swagger
 * /time-periods/available:
 *   get:
 *     summary: Retrieve the last 10 available time periods
 *     responses:
 *       200:
 *         description: Available time periods retrieved successfully
 */
router.get("/time-periods/available", async (req, res) => {
	const pastCount = parseInt(req.query.pastCount, 10) || 10;
	const query = req.app.locals
		.db("TimePeriods")
		.orderBy("start_date", "desc")
		.limit(pastCount);
	logger.info(`Executing query: ${query.toString()}`);
	const weeks = await query;
	logger.info(`Query results: ${JSON.stringify(weeks)}`);
	res.json(weeks);
});

export default router;
