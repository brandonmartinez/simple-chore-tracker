import logger from "./logger.js";

export const fetchRewards = async () => {
	try {
		logger.info("Fetching rewards from API");
		const response = await fetch("/api/rewards", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		logger.info("Successfully fetched rewards", data);
		return data;
	} catch (error) {
		logger.error("Error fetching rewards", error);
		throw error;
	}
};

export const addReward = async (reward) => {
	try {
		logger.info("Adding a new reward", reward);
		const response = await fetch("/api/rewards", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reward),
		});
		const data = await response.json();
		logger.info("Successfully added reward", data);
		return data;
	} catch (error) {
		logger.error("Error adding reward", error);
		throw error;
	}
};

export const updateReward = async (id, updates) => {
	try {
		logger.info(`Updating reward with ID ${id}`, updates);
		const response = await fetch(`/rewards/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updates),
		});
		const data = await response.json();
		logger.info("Successfully updated reward", data);
		return data;
	} catch (error) {
		logger.error(`Error updating reward with ID ${id}`, error);
		throw error;
	}
};

export const removeReward = async (id) => {
	try {
		logger.info(`Removing reward with ID ${id}`);
		const response = await fetch(`/rewards/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		logger.info("Successfully removed reward", data);
		return data;
	} catch (error) {
		logger.error(`Error removing reward with ID ${id}`, error);
		throw error;
	}
};
