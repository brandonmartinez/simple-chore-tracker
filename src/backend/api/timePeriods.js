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
 *     summary: Retrieve the latest available time periods around the current datetime
 *     responses:
 *       200:
 *         description: Available time periods retrieved successfully
 */
router.get("/time-periods/available", async (req, res) => {
	const limit = parseInt(req.query.limit, 10) || 10;
	const todayPlus7 = new Date();
	todayPlus7.setDate(todayPlus7.getDate() + 7);

	const query = req.app.locals
		.db("TimePeriods")
		.where("start_date", "<=", todayPlus7)
		.orderBy("start_date", "desc")
		.limit(limit + 1);

	logger.info(`Executing query: ${query.toString()}`);
	const availableTimePeriods = await query;
	logger.info(`Query results: ${JSON.stringify(availableTimePeriods)}`);

	res.json(availableTimePeriods.slice(0, limit));
});

/**
 * @swagger
 * /time-periods/:id:
 *   patch:
 *     summary: Update a time period
 *     responses:
 *       200:
 *         description: Time period updated successfully
 */
router.patch("/time-periods/:id", async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	if (!updates || typeof updates !== "object") {
		return res.status(400).json({ error: "Invalid updates object" });
	}

	try {
		const existingTimePeriod = await req.app.locals
			.db("TimePeriods")
			.where({ id })
			.first();
		if (!existingTimePeriod) {
			return res.status(404).json({ error: "Time period not found" });
		}

		const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
			if (updates[key] !== existingTimePeriod[key]) {
				acc[key] = updates[key];
			}
			return acc;
		}, {});

		if (Object.keys(filteredUpdates).length === 0) {
			return res.status(400).json({ error: "No changes detected" });
		}

		await req.app.locals
			.db("TimePeriods")
			.where({ id })
			.update(filteredUpdates);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error updating time period:", error);
		res.status(500).json({ error: "Failed to update time period" });
	}
});

export default router;
