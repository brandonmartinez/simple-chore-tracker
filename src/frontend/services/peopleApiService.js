import logger from "./logger.js";

export const fetchPeople = async () => {
	try {
		logger.info("Fetching people from API");
		const response = await fetch("/api/people", {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully fetched people", data);
		return data;
	} catch (error) {
		logger.error("Error fetching people", error);
		throw error;
	}
};

export const addPerson = async (person) => {
	try {
		logger.info("Adding a new person", person);
		const response = await fetch("/api/people", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(person),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully added person", data);
		return data;
	} catch (error) {
		logger.error("Error adding person", error);
		throw error;
	}
};

export const updatePerson = async (id, updates) => {
	try {
		logger.info(`Updating person with ID ${id}`, updates);
		const response = await fetch(`/people/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(updates),
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully updated person", data);
		return data;
	} catch (error) {
		logger.error(`Error updating person with ID ${id}`, error);
		throw error;
	}
};

export const removePerson = async (id) => {
	try {
		logger.info(`Removing person with ID ${id}`);
		const response = await fetch(`/people/${id}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		});
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		logger.info("Successfully removed person", data);
		return data;
	} catch (error) {
		logger.error(`Error removing person with ID ${id}`, error);
		throw error;
	}
};
