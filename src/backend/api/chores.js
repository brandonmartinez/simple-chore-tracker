import express from "express";
const router = express.Router();
import logger from "../logger.js";

router.get("/chores", async (req, res) => {
	const { includeDeleted } = req.query;
	let query = req.app.locals.db("Chores").select("*");

	if (!includeDeleted) {
		query = query.where("deleted", "!=", true);
	}

	logger.info(`Executing query: ${query.toString()}`);
	const chores = await query;
	logger.info(`Query results: ${JSON.stringify(chores)}`);
	res.json(chores);
});

router.post("/chores", async (req, res) => {
	try {
		const [id] = await req.app.locals
			.db("Chores")
			.insert(req.body)
			.returning("id");
		logger.info(`Inserted chore with ID: ${id}`);
		res.json({ id });
	} catch (error) {
		logger.error("Error inserting chore:", error);
		res.status(500).json({ error: "Failed to add chore." });
	}
});

// Update endpoint to handle general chore updates
router.patch("/chores/:id", async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	if (!updates || typeof updates !== "object") {
		return res.status(400).json({ error: "Invalid updates object" });
	}

	try {
		const existingChore = await req.app.locals
			.db("Chores")
			.where({ id })
			.first();
		if (!existingChore) {
			return res.status(404).json({ error: "Chore not found" });
		}

		const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
			if (updates[key] !== existingChore[key]) {
				acc[key] = updates[key];
			}
			return acc;
		}, {});

		if (Object.keys(filteredUpdates).length === 0 && !updates.deleted) {
			return res.status(400).json({ error: "No changes detected" });
		}

		await req.app.locals.db("Chores").where({ id }).update(filteredUpdates);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error updating chore:", error);
		res.status(500).json({ error: "Failed to update chore" });
	}
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

// POST endpoint to submit a completed chore
router.post("/chores/completions", async (req, res) => {
	const { chore_id, person_id, time_period_id, points_earned } = req.body;

	if (
		!chore_id ||
		!person_id ||
		!time_period_id ||
		points_earned === undefined
	) {
		logger.error(
			"Missing required fields in chore completion submission",
			req.body
		);
		return res.status(400).json({ error: "Missing required fields" });
	}

	try {
		const [id] = await req.app.locals
			.db("ChoreCompletions")
			.insert({
				chore_id,
				person_id,
				time_period_id,
				points_earned,
			})
			.returning("id");

		logger.info(`Chore completion submitted with ID: ${id}`);
		res.status(201).json({ id });
	} catch (error) {
		logger.error("Error submitting chore completion:", error);
		res.status(500).json({ error: "Failed to submit chore completion." });
	}
});

// GET endpoint to retrieve chore completions
router.get("/chores/completions", async (req, res) => {
	const { time_period_id, person_id, chore_id } = req.query;

	let query = req.app.locals.db("ChoreCompletions").select("*");

	if (time_period_id) {
		query = query.where("time_period_id", time_period_id);
	}

	if (person_id) {
		query = query.where("person_id", person_id);
	}

	if (chore_id) {
		query = query.where("chore_id", chore_id);
	}

	logger.info(`Executing query: ${query.toString()}`);

	try {
		const completions = await query;
		logger.info(`Query results: ${JSON.stringify(completions)}`);
		res.json(completions);
	} catch (error) {
		logger.error("Error retrieving chore completions:", error);
		res.status(500).json({ error: "Failed to retrieve chore completions." });
	}
});

export default router;
