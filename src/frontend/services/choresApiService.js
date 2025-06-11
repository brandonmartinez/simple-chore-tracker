import logger from "./logger.js";

export async function fetchChores() {
	logger.info("Fetching chores from API");
	const response = await fetch("/api/chores");
	if (!response.ok) {
		logger.error("Failed to fetch chores", { status: response.status });
		throw new Error("Failed to fetch chores");
	}
	return response.json();
}

export async function addChore(chore) {
	logger.info("Adding new chore to API", { chore });
	const response = await fetch("/api/chores", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(chore),
	});
	if (!response.ok) {
		const errorText = await response.text();
		logger.error("Failed to add chore", {
			status: response.status,
			error: errorText,
		});
		throw new Error("Failed to add chore");
	}
	return response.json();
}

export async function updateChore(choreId, updates) {
	logger.info("Updating chore", { choreId, updates });
	const response = await fetch(`/api/chores/${choreId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(updates),
	});
	if (!response.ok) {
		logger.error("Failed to update chore", { status: response.status });
		throw new Error("Failed to update chore");
	}
	return response.json();
}

export async function removeChore(choreId) {
	logger.info("Removing chore", { choreId });
	const response = await fetch(`/api/chores/${choreId}`, {
		method: "DELETE",
	});
	if (!response.ok) {
		logger.error("Failed to remove chore", { status: response.status });
		throw new Error("Failed to remove chore");
	}
	return response.json();
}

export async function fetchChoreAssignments(params = {}) {
	logger.info("Fetching chore assignments", { params });
	const query = new URLSearchParams(params).toString();
	const response = await fetch(`/api/chores/assignments?${query}`);
	if (!response.ok) {
		logger.error("Failed to fetch chore assignments", {
			status: response.status,
		});
		throw new Error("Failed to fetch chore assignments");
	}
	return response.json();
}

export async function assignChore(assignment) {
	logger.info("Assigning chore", { assignment });
	const response = await fetch(`/api/chores/assignments`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(assignment),
	});
	if (!response.ok) {
		logger.error("Failed to assign chore", { status: response.status });
		throw new Error("Failed to assign chore");
	}
	return response.json();
}

export async function removeChoreAssignment(choreId, timePeriodId) {
	logger.info("Removing chore assignment", { choreId, timePeriodId });
	const response = await fetch(`/api/chores/assignments`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chore_id: choreId, time_period_id: timePeriodId }),
	});
	if (!response.ok) {
		logger.error("Failed to remove chore assignment", {
			status: response.status,
		});
		throw new Error("Failed to remove chore assignment");
	}
	return response.json();
}
