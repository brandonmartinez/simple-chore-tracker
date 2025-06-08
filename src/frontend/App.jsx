import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import ChoreGrid from "./components/ChoreGrid";
import ChoreEditor from "./components/ChoreEditor";
import Navbar from "./components/Navbar";
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

	const groupedChores = chores.reduce((acc, chore) => {
		const category = chore.category || "Uncategorized";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(chore);
		return acc;
	}, {});

	const sortedCategories = Object.keys(groupedChores).sort();

	return (
		<Router>
			<div className="p-4">
				<Navbar />
				<Routes>
					<Route path="/" element={<Navigate to="/chores" replace />} />
					<Route
						path="/chores"
						element={
							<ChoreGrid
								people={people}
								groupedChores={groupedChores}
								sortedCategories={sortedCategories}
								timePeriod={timePeriod}
								availableTimePeriods={availableWeeks}
								setTimePeriod={setTimePeriod}
								setChores={setChores}
							/>
						}
					/>
					<Route
						path="/chores/editor"
						element={
							<ChoreEditor
								chores={chores}
								setChores={setChores}
								onAddChore={(newChore) => {
									setChores((prevChores) => [...prevChores, newChore]);
								}}
								onUpdateChore={(id, updatedChore) => {
									setChores((prevChores) =>
										prevChores.map((chore) =>
											chore.id === id ? updatedChore : chore
										)
									);
								}}
							/>
						}
					/>
					<Route path="/people" element={<div>People Component</div>} />
					<Route
						path="/time-periods"
						element={<div>Time Period Component</div>}
					/>
				</Routes>
			</div>
		</Router>
	);
}
