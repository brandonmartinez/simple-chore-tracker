export async function fetchChores() {
	const response = await fetch("/api/chores");
	return response.json();
}

export async function fetchPeople() {
	const response = await fetch("/api/people");
	return response.json();
}

export async function fetchCurrentTimePeriod() {
	const response = await fetch("/api/current-time-period");
	return response.json();
}

export async function fetchAssignments() {
	const response = await fetch("/api/chore-assignments");
	return response.json();
}

export async function assignChore(choreId, personId, timePeriodId) {
	await fetch(`/api/chore-assignments`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chore_id: choreId,
			person_id: personId,
			time_period_id: timePeriodId,
		}),
	});
}

export async function completeChore(choreId, timePeriodId) {
	await fetch(`/api/chore-assignments`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chore_id: choreId, time_period_id: timePeriodId }),
	});
}

export async function removeAssignment(choreId, timePeriodId) {
	console.log("Sending DELETE request:", { choreId, timePeriodId });
	const response = await fetch(`/api/chore-assignments`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chore_id: choreId, time_period_id: timePeriodId }),
	});
	const result = await response.json();
	console.log("DELETE response received:", result);
}
