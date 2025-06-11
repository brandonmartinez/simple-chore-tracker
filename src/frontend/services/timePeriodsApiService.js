import { fetchItems, addItems, updateItem, removeItem } from "./apiHelpers.js";
import logger from "./logger.js";

export async function fetchTimePeriods() {
	return await fetchItems("time-periods");
}

export async function addTimePeriod(timePeriod) {
	return await addItems("time-periods", "timePeriod", timePeriod);
}

export async function updateTimePeriod(timePeriodId, updates) {
	return await updateItem("time-periods", "timePeriod", timePeriodId, updates);
}

export async function removeTimePeriod(timePeriodId) {
	return await removeItem("time-periods", "timePeriod", timePeriodId);
}

export async function fetchCurrentTimePeriod() {
	return await fetchItems("time-periods/current");
}

export async function fetchAvailableTimePeriods(limit = 10) {
	try {
		logger.info("Fetching available time periods", { limit });
		const response = await fetch(`/api/time-periods/available?limit=${limit}`, {
			headers: { "Content-Type": "application/json" },
		});
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
}
