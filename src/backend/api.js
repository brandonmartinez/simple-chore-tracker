import express from "express";
const router = express.Router();
import logger from "./logger.js";

// People endpoints
router.get("/people", async (req, res) => {
	const query = req.app.locals.db("People").select("*");
	logger.info(`Executing query: ${query.toString()}`);
	const people = await query;
	logger.info(`Query results: ${JSON.stringify(people)}`);
	res.json(people);
});

router.post("/people", async (req, res) => {
	const query = req.app.locals.db("People").insert(req.body);
	logger.info(`Executing query: ${query.toString()}`);
	const [id] = await query;
	logger.info(`Query results: ${JSON.stringify({ id })}`);
	res.json({ id });
});

// Chores endpoints
router.get("/chores", async (req, res) => {
	const query = req.app.locals.db("Chores").select("*");
	logger.info(`Executing query: ${query.toString()}`);
	const chores = await query;
	logger.info(`Query results: ${JSON.stringify(chores)}`);
	res.json(chores);
});

router.post("/chores", async (req, res) => {
	const query = req.app.locals.db("Chores").insert(req.body);
	logger.info(`Executing query: ${query.toString()}`);
	const [id] = await query;
	logger.info(`Query results: ${JSON.stringify({ id })}`);
	res.json({ id });
});

// Update endpoints to be under '/chores/assignments/available'
router.get("/chores/assignments/available", async (req, res) => {
	const assignments = await req.app.locals
		.db("ChoreAvailableAssignments")
		.select("*");
	res.json(assignments);
});

router.post("/chores/assignments/available", async (req, res) => {
	const [id] = await req.app.locals
		.db("ChoreAvailableAssignments")
		.insert(req.body);
	res.json({ id });
});

// ChoreAssignments endpoints
router.get("/chores/assignments", async (req, res) => {
	const { timePeriodId } = req.query;
	let query = req.app.locals.db("ChoreAssignments").select("*");

	if (timePeriodId) {
		query = query.where("time_period_id", timePeriodId);
	}

	console.log("Executing query:", query.toString()); // Log the query being executed

	const assignments = await query;
	console.log("Query results:", assignments); // Log the query results
	res.json(assignments);
});

router.post("/chores/assignments", async (req, res) => {
	const { chore_id, person_id, time_period_id } = req.body;
	try {
		// Check if an assignment already exists for the chore and time period
		const existingAssignment = await req.app.locals
			.db("ChoreAssignments")
			.where({ chore_id, time_period_id })
			.first();

		if (existingAssignment) {
			// Update the existing assignment
			await req.app.locals
				.db("ChoreAssignments")
				.where({ id: existingAssignment.id })
				.update({ person_id });
		} else {
			// Create a new assignment
			await req.app.locals
				.db("ChoreAssignments")
				.insert({ chore_id, person_id, time_period_id });
		}

		res.status(201).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: "Failed to assign chore." });
	}
});

// Add endpoint to remove assignments
router.delete("/chores/assignments", async (req, res) => {
	const { chore_id, time_period_id } = req.body;
	console.log("DELETE request received:", { chore_id, time_period_id });
	try {
		const result = await req.app.locals
			.db("ChoreAssignments")
			.where({ chore_id, time_period_id })
			.del();
		console.log("Database delete result:", result);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error deleting assignment:", error);
		res.status(500).json({ error: "Failed to remove assignment." });
	}
});

// Rewards endpoints
router.get("/rewards", async (req, res) => {
	const rewards = await req.app.locals.db("Rewards").select("*");
	res.json(rewards);
});

router.post("/rewards", async (req, res) => {
	const [id] = await req.app.locals.db("Rewards").insert(req.body);
	res.json({ id });
});

// RewardClaims endpoints
router.get("/reward-claims", async (req, res) => {
	const claims = await req.app.locals.db("RewardClaims").select("*");
	res.json(claims);
});

router.post("/reward-claims", async (req, res) => {
	const [id] = await req.app.locals.db("RewardClaims").insert(req.body);
	res.json({ id });
});

// TimePeriods endpoints
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

// Assignments endpoint
router.get("/assignments", async (req, res) => {
	const { timePeriodId } = req.query;
	if (!timePeriodId) {
		return res.status(400).json({ error: "Missing timePeriodId parameter" });
	}
	const assignments = await req.app.locals
		.db("Assignments")
		.where("time_period_id", timePeriodId)
		.select("chore_id", "person_id", "time_period_id");
	res.json(assignments);
});

export default router;
