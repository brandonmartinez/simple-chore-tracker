import express from "express";
const router = express.Router();
import logger from "../logger.js";

router.get("/time-periods", async (req, res) => {
	const query = req.app.locals.db("TimePeriods").select("*");
	console.log("Executing query:", query.toString());
	const periods = await query;
	console.log("Query results:", periods);
	res.json(periods);
});

router.post("/time-periods", async (req, res) => {
	const query = req.app.locals.db("TimePeriods").insert(req.body);
	console.log("Executing query:", query.toString());
	const [id] = await query;
	console.log("Query results:", { id });
	res.json({ id });
});

// Update endpoint to have a more REST-like structure
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

// Endpoint to dynamically generate and return the last 10 weeks
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
