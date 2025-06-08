export async function fetchChores() {
	const response = await fetch("/api/chores");
	return response.json();
}

export async function fetchPeople() {
	const response = await fetch("/api/people");
	return response.json();
}

export async function fetchCurrentTimePeriod() {
	const response = await fetch("/api/time-periods/current");
	return response.json();
}

export async function fetchAssignments(timePeriodId) {
	const response = await fetch(
		`/api/chores/assignments?timePeriodId=${timePeriodId}`
	);
	if (!response.ok) {
		throw new Error("Failed to fetch assignments");
	}
	return response.json();
}

export async function assignChore(choreId, personId, timePeriodId) {
	await fetch(`/api/chores/assignments`, {
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
	await fetch(`/api/chores/assignments`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chore_id: choreId, time_period_id: timePeriodId }),
	});
}

export async function removeAssignment(choreId, timePeriodId) {
	console.log("Sending DELETE request:", { choreId, timePeriodId });
	const response = await fetch(`/api/chores/assignments`, {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chore_id: choreId, time_period_id: timePeriodId }),
	});
	const result = await response.json();
	console.log("DELETE response received:", result);
}

export async function fetchAvailableWeeks() {
	const response = await fetch("/api/time-periods/available?pastCount=10");
	if (!response.ok) {
		throw new Error("Failed to fetch available weeks");
	}
	return response.json();
}

export async function addChore(newChore) {
	newChore.points = Number(newChore.points);
	if (isNaN(newChore.points) || newChore.points <= 0) {
		throw new Error("Invalid chore points");
	}

	if (!newChore.title || typeof newChore.title !== "string") {
		throw new Error("Invalid chore title");
	}
	if (!newChore.category || typeof newChore.category !== "string") {
		throw new Error("Invalid chore category");
	}

	console.log("Sending chore to API:", newChore);
	const response = await fetch("/api/chores", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newChore),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("API error response:", errorText);
		throw new Error("Failed to add chore");
	}

	return response.json();
}

export async function markChoreAsDeleted(choreId) {
	const response = await fetch(`/api/chores/${choreId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deleted: true }),
	});

	if (!response.ok) {
		throw new Error("Failed to mark chore as deleted");
	}
}

export async function fetchRewards() {
	const response = await fetch("/api/rewards");
	return response.json();
}

export async function addReward(newReward) {
	newReward.points_cost = Number(newReward.points_cost);
	if (isNaN(newReward.points_cost) || newReward.points_cost <= 0) {
		throw new Error("Invalid reward points cost");
	}

	if (!newReward.title || typeof newReward.title !== "string") {
		throw new Error("Invalid reward title");
	}

	console.log("Sending reward to API:", newReward);
	const response = await fetch("/api/rewards", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(newReward),
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error("API error response:", errorText);
		throw new Error("Failed to add reward");
	}

	return response.json();
}

export async function markRewardAsDeleted(rewardId) {
	const response = await fetch(`/api/rewards/${rewardId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deleted: true }),
	});

	if (!response.ok) {
		throw new Error("Failed to mark reward as deleted");
	}
}
