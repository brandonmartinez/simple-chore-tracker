import { fetchItems, addItems, updateItem, removeItem } from "./apiHelpers.js";
import logger from "./logger.js";

export async function fetchChores() {
	return await fetchItems("chores");
}

export async function addChore(chore) {
	return await addItems("chores", "chore", chore);
}

export async function updateChore(choreId, updates) {
	return await updateItem("chores", "chore", choreId, updates);
}

export async function removeChore(choreId) {
	return await removeItem("chores", "chore", choreId);
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

export async function fetchChoreCompletions({ time_period_id }) {
	const options = { params: {} };
	if (time_period_id !== undefined && time_period_id !== null) {
		options.params.time_period_id = time_period_id;
	}
	return await fetchItems("chores/completions", options);
}

export async function addChoreCompletion(choreCompletion) {
	return await addItems(
		"chores/completions",
		"chores/completion",
		choreCompletion
	);
}

export async function removeChoreCompletion(choreCompletionId) {
	return await removeItem(
		"chores/completions",
		"chores/completion",
		choreCompletionId
	);
}
