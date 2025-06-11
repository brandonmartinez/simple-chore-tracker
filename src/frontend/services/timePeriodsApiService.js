import logger from "./logger.js";

export const fetchTimePeriods = async () => {
	try {
		logger.info("Fetching time periods from API");
		const response = await fetch("/api/time-periods", {
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully fetched time periods", data);
		return data;
	} catch (error) {
		logger.error("Error fetching time periods", error);
		throw error;
	}
};

export const addTimePeriod = async (timePeriod) => {
	try {
		logger.info("Adding a new time period", timePeriod);
		const response = await fetch("/api/time-periods", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(timePeriod),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully added time period", data);
		return data;
	} catch (error) {
		logger.error("Error adding time period", error);
		throw error;
	}
};

export const updateTimePeriod = async (id, updates) => {
	try {
		logger.info(`Updating time period with ID ${id}`, updates);
		const response = await fetch(`/time-periods/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updates),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully updated time period", data);
		return data;
	} catch (error) {
		logger.error(`Error updating time period with ID ${id}`, error);
		throw error;
	}
};

export const removeTimePeriod = async (id) => {
	try {
		logger.info(`Removing time period with ID ${id}`);
		const response = await fetch(`/time-periods/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully removed time period", data);
		return data;
	} catch (error) {
		logger.error(`Error removing time period with ID ${id}`, error);
		throw error;
	}
};

export const fetchCurrentTimePeriod = async () => {
	try {
		logger.info("Fetching the current time period");
		const response = await fetch("/api/time-periods/current", {
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully fetched the current time period", data);
		return data;
	} catch (error) {
		logger.error("Error fetching the current time period", error);
		throw error;
	}
};

export const fetchAvailableTimePeriods = async (pastCount = 10) => {
	try {
		logger.info("Fetching available time periods", { pastCount });
		const response = await fetch(
			`/api/time-periods/available?pastCount=${pastCount}`,
			{
				headers: { "Content-Type": "application/json" },
			}
		);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully fetched available time periods", data);
		return data;
	} catch (error) {
		logger.error("Error fetching available time periods", error);
		throw error;
	}
};
