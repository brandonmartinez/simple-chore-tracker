import React, { useEffect, useState } from "react";
import ChoreGrid from "./ChoreGrid";
import {
	fetchChores,
	fetchPeople,
	fetchCurrentTimePeriod,
	fetchAssignments,
	fetchAvailableWeeks,
	assignChore,
	completeChore,
	removeAssignment,
} from "./apiService";

export default function App() {
	const [chores, setChores] = useState([]);
	const [people, setPeople] = useState([]);
	const [timePeriod, setTimePeriod] = useState(null);
	const [availableWeeks, setAvailableWeeks] = useState([]);

	useEffect(() => {
		console.log("Fetching initial data...");
		fetchChores().then((chores) => {
			console.log("Fetched chores:", chores);
			setChores(chores);
		});
		fetchPeople().then((people) => {
			console.log("Fetched people:", people);
			setPeople(people);
		});
		fetchAvailableWeeks().then((weeks) => {
			console.log("Fetched available weeks:", weeks);
			setAvailableWeeks(weeks);
		});
		fetchCurrentTimePeriod().then((period) => {
			console.log("Fetched current time period:", period);
			setTimePeriod(period);
		});
	}, []);

	useEffect(() => {
		if (!timePeriod) {
			console.log("No time period selected.");
			return;
		}
		console.log("Time period selected:", timePeriod);

		fetchAssignments(timePeriod.id).then((assignments) => {
			console.log("Fetched assignments for time period:", assignments);
			setChores((prevChores) => {
				// Clear all assignments first
				const clearedChores = prevChores.map((chore) => ({
					...chore,
					assignedTo: [],
				}));
				console.log("Cleared chores state:", clearedChores);

				if (assignments.length === 0) {
					console.log("No assignments found for the current time period.");
					return clearedChores;
				}

				// Reassign based on fetched assignments
				const updatedChores = clearedChores.map((chore) => {
					const assignment = assignments.find(
						(a) => a.chore_id === chore.id && a.time_period_id === timePeriod.id
					);
					return assignment
						? {
								...chore,
								assignedTo: assignment.person_id ? [assignment.person_id] : [],
						  }
						: chore;
				});
				console.log("Updated chores state:", updatedChores);
				return updatedChores;
			});
		});
	}, [timePeriod]);

	function formatDate(dateStr) {
		// Parse as UTC if dateStr is in 'YYYY-MM-DD' format to avoid timezone issues
		let date;
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
			const [year, month, day] = dateStr.split("-");
			date = new Date(Date.UTC(year, month - 1, day));
		} else {
			date = new Date(dateStr);
		}
		const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
		const dd = String(date.getUTCDate()).padStart(2, "0");
		const yyyy = date.getUTCFullYear();
		return `${mm}/${dd}/${yyyy}`;
	}

	const groupedChores = chores.reduce((acc, chore) => {
		const category = chore.category || "Uncategorized";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(chore);
		return acc;
	}, {});

	const sortedCategories = Object.keys(groupedChores).sort();

	function handleAssign(choreId, personId) {
		if (!timePeriod || !timePeriod.id) {
			console.error("Invalid timePeriod", timePeriod);
			return;
		}
		console.log(
			`Assigning chore ${choreId} to person ${personId} for time period ${timePeriod.id}`
		);
		assignChore(choreId, personId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [personId] } : chore
				);
				console.log("Updated chores state after assignment:", updatedChores);
				return updatedChores;
			});
		});
	}

	function handleComplete(choreId) {
		console.log(`Completing chore ${choreId} for time period ${timePeriod.id}`);
		completeChore(choreId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, completed: true } : chore
				);
				console.log("Updated chores state after completion:", updatedChores);
				return updatedChores;
			});
		});
	}

	function handleRemoveAssignment(choreId) {
		console.log(
			`Removing assignment for chore ${choreId} in time period ${timePeriod.id}`
		);
		removeAssignment(choreId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [] } : chore
				);
				console.log(
					"Updated chores state after removing assignment:",
					updatedChores
				);
				return updatedChores;
			});
		});
	}

	function handleWeekChange(event) {
		const selectedId = parseInt(event.target.value, 10);
		const selectedWeek = availableWeeks.find((week) => week.id === selectedId);
		console.log("Selected week ID:", selectedId);
		console.log("Available weeks:", availableWeeks);
		if (selectedWeek) {
			console.log("Week changed to:", selectedWeek);
			setTimePeriod(selectedWeek);
		} else {
			console.error("Selected week not found in availableWeeks.");
		}
	}

	return (
		<div className="p-4">
			<h1 className="text-6xl">Simple Chore Tracker</h1>
			{timePeriod && (
				<div>
					<select
						id="week-select"
						value={timePeriod.id}
						onChange={handleWeekChange}
					>
						{availableWeeks.map((week) => (
							<option key={week.id} value={week.id}>
								Week of {formatDate(week.start_date)}
							</option>
						))}
					</select>
				</div>
			)}
			<ChoreGrid
				people={people}
				groupedChores={groupedChores}
				sortedCategories={sortedCategories}
				onAssign={handleAssign}
				onComplete={handleComplete}
				onRemoveAssignment={handleRemoveAssignment}
			/>
		</div>
	);
}
