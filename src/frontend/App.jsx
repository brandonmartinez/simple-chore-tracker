import React, { useEffect, useState } from "react";
import ChoreGrid from "./ChoreGrid";
import {
	fetchChores,
	fetchPeople,
	fetchCurrentTimePeriod,
	fetchAssignments,
	assignChore,
	completeChore,
	removeAssignment,
} from "./apiService";

export default function App() {
	const [chores, setChores] = useState([]);
	const [people, setPeople] = useState([]);
	const [timePeriod, setTimePeriod] = useState(null);

	useEffect(() => {
		fetchChores().then(setChores);
		fetchPeople().then(setPeople);
		fetchCurrentTimePeriod().then(setTimePeriod);
	}, []);

	useEffect(() => {
		if (!timePeriod) return;

		fetchAssignments().then((assignments) => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) => {
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
				return JSON.stringify(updatedChores) === JSON.stringify(prevChores)
					? prevChores
					: updatedChores;
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
		assignChore(choreId, personId, timePeriod.id).then(() => {
			setChores((prevChores) =>
				prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [personId] } : chore
				)
			);
		});
	}

	function handleComplete(choreId) {
		completeChore(choreId, timePeriod.id).then(() => {
			setChores((prevChores) =>
				prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, completed: true } : chore
				)
			);
		});
	}

	function handleRemoveAssignment(choreId) {
		console.log("Removing assignment for chore:", choreId);
		removeAssignment(choreId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [] } : chore
				);
				console.log("Updated chores state:", updatedChores);
				return updatedChores;
			});
		});
	}

	return (
		<div>
			<h1>Simple Chore Tracker</h1>
			{timePeriod && <h2>Week of {formatDate(timePeriod.start_date)}</h2>}
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
