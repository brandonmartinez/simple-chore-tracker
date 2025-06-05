import express from "express";
const router = express.Router();

// People endpoints
router.get("/people", async (req, res) => {
	const people = await req.app.locals.db("People").select("*");
	res.json(people);
});

router.post("/people", async (req, res) => {
	const [id] = await req.app.locals.db("People").insert(req.body);
	res.json({ id });
});

// Chores endpoints
router.get("/chores", async (req, res) => {
	const chores = await req.app.locals.db("Chores").select("*");
	res.json(chores);
});

router.post("/chores", async (req, res) => {
	const [id] = await req.app.locals.db("Chores").insert(req.body);
	res.json({ id });
});

// ChoreAvailableAssignments endpoints
router.get("/chore-available-assignments", async (req, res) => {
	const assignments = await req.app.locals
		.db("ChoreAvailableAssignments")
		.select("*");
	res.json(assignments);
});

router.post("/chore-available-assignments", async (req, res) => {
	const [id] = await req.app.locals
		.db("ChoreAvailableAssignments")
		.insert(req.body);
	res.json({ id });
});

// ChoreAssignments endpoints
router.get("/chore-assignments", async (req, res) => {
	const assignments = await req.app.locals.db("ChoreAssignments").select("*");
	res.json(assignments);
});

router.post("/chore-assignments", async (req, res) => {
	const [id] = await req.app.locals.db("ChoreAssignments").insert(req.body);
	res.json({ id });
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
	const periods = await req.app.locals.db("TimePeriods").select("*");
	res.json(periods);
});

router.post("/time-periods", async (req, res) => {
	const [id] = await req.app.locals.db("TimePeriods").insert(req.body);
	res.json({ id });
});

// Add endpoint to fetch or create the current time period
router.get("/current-time-period", async (req, res) => {
	const currentDate = new Date();

	// Calculate the beginning of the week (Sunday)
	const beginningOfWeek = new Date(currentDate);
	beginningOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
	beginningOfWeek.setHours(0, 0, 0, 0);

	// Search for the time period starting from the beginning of the week
	let timePeriod = await req.app.locals
		.db("TimePeriods")
		.where("start_date", beginningOfWeek)
		.first();

	// If no time period exists, create a new one
	if (!timePeriod) {
		const insertResult = await req.app.locals.db("TimePeriods").insert({
			start_date: beginningOfWeek,
			end_date: new Date(beginningOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000), // End of the week (Saturday)
			name: `Week of ${beginningOfWeek.toISOString().split("T")[0]}`, // Generate a name based on the start date
		});

		const id = insertResult[0]; // Extract the ID from the result

		timePeriod = await req.app.locals.db("TimePeriods").where("id", id).first();
	}

	res.json(timePeriod);
});

export default router;
