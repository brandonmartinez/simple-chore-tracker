import React, { useState, useEffect } from "react";
import ChoreCell from "./ChoreCell";
import {
	assignChore,
	removeChoreAssignment,
	addChoreCompletion,
	fetchChoreAssignments,
	fetchChoreCompletions,
} from "../services/choresApiService";

function ChoreGrid({
	people,
	peoplePointTotals,
	setPeoplePointTotals,
	chores,
	timePeriod,
	timePeriods,
	setTimePeriod,
}) {
	const [choreCompletions, setChoreCompletions] = useState({});
	const [choreAssignments, setChoreAssignments] = useState({});

	useEffect(() => {
		if (chores) {
			fetchChoreAssignments().then((assignments) => {
				const assignmentsMap = {};
				assignments.forEach((assignment) => {
					if (!assignmentsMap[assignment.chore_id]) {
						assignmentsMap[assignment.chore_id] = [];
					}
					assignmentsMap[assignment.chore_id].push(assignment.person_id);
				});
				setChoreAssignments(assignmentsMap);
			});

			const choreCompletionOptions = {};
			if (!!timePeriod) {
				choreCompletionOptions.time_period_id = timePeriod.id;
			}
			fetchChoreCompletions(choreCompletionOptions).then((completions) => {
				const completionsMap = {};
				completions.forEach((completion) => {
					if (!completionsMap[completion.chore_id]) {
						completionsMap[completion.chore_id] = {};
					}
					if (!completionsMap[completion.chore_id][completion.person_id]) {
						completionsMap[completion.chore_id][completion.person_id] = [];
					}
					completionsMap[completion.chore_id][completion.person_id].push(
						completion
					);
				});
				setChoreCompletions(completionsMap);
			});
		}
	}, [chores]);

	const groupedChores = chores.reduce((acc, chore) => {
		const category = chore.category || "Uncategorized";
		if (!acc[category]) {
			acc[category] = [];
		}
		acc[category].push(chore);
		return acc;
	}, {});

	const sortedCategories = Object.keys(groupedChores).sort();

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

	function handleAssign(choreId, personId) {
		if (!timePeriod || !timePeriod.id) {
			console.error("Invalid timePeriod", timePeriod);
			return;
		}
		assignChore({
			chore_id: choreId,
			person_id: personId,
			time_period_id: timePeriod.id,
		}).then(() => {
			setChoreAssignments((prev) => ({
				...prev,
				[choreId]: [personId],
			}));
		});
	}

	function handleCompletion(choreId, personId) {
		addChoreCompletion({
			chore_id: choreId,
			person_id: personId,
			time_period_id: timePeriod.id,
		}).then((choreCompletion) => {
			setChoreCompletions((prev) => {
				const prevChore = prev[choreId] || {};
				const prevPersonCompletions = prevChore[personId] || [];

				return {
					...prev,
					[choreId]: {
						...prevChore,
						[personId]: [...prevPersonCompletions, choreCompletion],
					},
				};
			});

			setPeoplePointTotals((prevTotals) => {
				return prevTotals.map((pt) =>
					pt.person_id === personId
						? {
								...pt,
								total_points: pt.total_points + choreCompletion.points_earned,
						  }
						: pt
				);
			});
		});
	}

	function handleRemoveAssignment(choreId) {
		removeChoreAssignment(choreId, timePeriod.id).then(() => {
			setChoreAssignments((prev) => ({
				...prev,
				[choreId]: [],
			}));
		});
	}

	function handleTimePeriodChange(event) {
		const selectedId = parseInt(event.target.value, 10);
		const selected = timePeriods.find((tp) => tp.id === selectedId);
		if (selected) {
			setTimePeriod(selected);
		} else {
			console.error(
				"Selected time period not found in available time periods."
			);
		}
	}

	return (
		<div
			className="gap-4 grid"
			style={{
				gridTemplateColumns: `repeat(${people.length + 1}, 1fr) 0.25fr`,
			}}
		>
			<div>
				<select
					id="time-period-select"
					value={timePeriod?.id || timePeriods[0]?.id || ""}
					onChange={handleTimePeriodChange}
					className="bg-slate-200 dark:bg-slate-700 p-2 border border-slate-300 dark:border-slate-600 rounded text-slate-800 dark:text-slate-100"
				>
					{timePeriods.map((tp) => (
						<option
							key={tp.id}
							value={tp.id}
							className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
						>
							{formatDate(tp.start_date)}
						</option>
					))}
				</select>
			</div>
			{people.map((person) => (
				<div
					key={person.id}
					className="bg-slate-300 dark:bg-slate-600 p-2 rounded font-bold text-center text-slate-800 dark:text-slate-100"
				>
					{person.name} (
					{peoplePointTotals.find((pt) => pt.person_id === person.id)
						?.total_points || 0}
					)
				</div>
			))}
			<div></div>
			{sortedCategories.map((category) => (
				<React.Fragment key={category}>
					<h3 className="col-span-full bg-slate-400 dark:bg-slate-700 p-2 rounded font-semibold text-lg text-slate-800 dark:text-slate-100">
						{category}
					</h3>
					{groupedChores[category]
						.sort((a, b) => a.title.localeCompare(b.title))
						.map((chore) => (
							<React.Fragment key={chore.id}>
								<div className="flex items-center bg-slate-300 dark:bg-slate-600 p-2 rounded font-bold text-slate-800 dark:text-slate-100">
									{chore.title}
								</div>
								{people.map((person) => (
									<ChoreCell
										key={person.id}
										chore={chore}
										person={person}
										completions={choreCompletions[chore.id]?.[person.id] || []}
										isAssigned={
											choreAssignments[chore.id]?.includes(person.id) || false
										}
										choreCompletion={choreCompletions[chore.id]}
										choreAssignment={choreAssignments[chore.id]}
										onAssign={handleAssign}
										onComplete={handleCompletion}
										onRemoveAssignment={handleRemoveAssignment}
									/>
								))}
								<div className="flex justify-center items-center bg-slate-400 dark:bg-slate-700 p-1 rounded font-bold text-slate-800 text-sm dark:text-slate-100">
									+{chore.points}
								</div>
							</React.Fragment>
						))}
				</React.Fragment>
			))}
		</div>
	);
}

export default ChoreGrid;
