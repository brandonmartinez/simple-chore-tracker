import express from "express";
const router = express.Router();
import logger from "../logger.js";

/**
 * @swagger
 * /rewards:
 *   get:
 *     summary: Retrieve a list of rewards
 *     responses:
 *       200:
 *         description: A list of rewards
 */
router.get("/rewards", async (req, res) => {
	const { includeDeleted } = req.query;
	let query = req.app.locals.db("Rewards").select("*");

	if (!includeDeleted) {
		query = query.where("deleted", "!=", true);
	}

	logger.info(`Executing query: ${query.toString()}`);
	const rewards = await query;
	logger.info(`Query results: ${JSON.stringify(rewards)}`);
	res.json(rewards);
});

/**
 * @swagger
 * /rewards:
 *   post:
 *     summary: Add a new reward
 *     responses:
 *       201:
 *         description: Reward added successfully
 */
router.post("/rewards", async (req, res) => {
	try {
		const query = req.app.locals.db("Rewards").insert(req.body);
		logger.info(`Executing query: ${query.toString()}`);
		const [id] = await query;
		logger.info(`Inserted reward with ID: ${id}`);
		res.json({ id });
	} catch (error) {
		logger.error("Error inserting reward:", error);
		res.status(500).json({ error: "Failed to add reward." });
	}
});

/**
 * @swagger
 * /rewards/:id:
 *   patch:
 *     summary: Update a reward
 *     responses:
 *       200:
 *         description: Reward updated successfully
 */
router.patch("/rewards/:id", async (req, res) => {
	const { id } = req.params;
	const updates = req.body;

	if (!updates || typeof updates !== "object") {
		return res.status(400).json({ error: "Invalid updates object" });
	}

	try {
		const existingReward = await req.app.locals
			.db("Rewards")
			.where({ id })
			.first();
		if (!existingReward) {
			return res.status(404).json({ error: "Reward not found" });
		}

		const filteredUpdates = Object.keys(updates).reduce((acc, key) => {
			if (updates[key] !== existingReward[key]) {
				acc[key] = updates[key];
			}
			return acc;
		}, {});

		if (Object.keys(filteredUpdates).length === 0 && !updates.deleted) {
			return res.status(400).json({ error: "No changes detected" });
		}

		await req.app.locals.db("Rewards").where({ id }).update(filteredUpdates);
		res.status(200).json({ success: true });
	} catch (error) {
		console.error("Error updating reward:", error);
		res.status(500).json({ error: "Failed to update reward" });
	}
});

/**
 * @swagger
 * /rewards/claims:
 *   get:
 *     summary: Retrieve reward claims
 *     responses:
 *       200:
 *         description: A list of reward claims
 */
router.get("/rewards/claims", async (req, res) => {
	const claims = await req.app.locals.db("RewardClaims").select("*");
	res.json(claims);
});

/**
 * @swagger
 * /rewards/claims:
 *   post:
 *     summary: Add a new reward claim
 *     responses:
 *       201:
 *         description: Reward claim added successfully
 */
router.post("/rewards/claims", async (req, res) => {
	const [id] = await req.app.locals.db("RewardClaims").insert(req.body);
	res.json({ id });
});

export default router;
