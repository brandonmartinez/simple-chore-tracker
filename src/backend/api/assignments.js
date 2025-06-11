import express from "express";
const router = express.Router();
import logger from "../logger.js";

// Assignments endpoint
router.get("/assignments", async (req, res) => {
	const { timePeriodId } = req.query;
	logger.info("Received request for assignments", { timePeriodId });

	if (!timePeriodId) {
		logger.warn("Missing timePeriodId parameter in request");
		return res.status(400).json({ error: "Missing timePeriodId parameter" });
	}

	try {
		const assignments = await req.app.locals
			.db("Assignments")
			.where("time_period_id", timePeriodId)
			.select("chore_id", "person_id", "time_period_id");
		logger.info("Assignments retrieved successfully", { assignments });
		res.json(assignments);
	} catch (error) {
		logger.error("Error retrieving assignments", { error });
		res.status(500).json({ error: "Failed to retrieve assignments." });
	}
});

export default router;
