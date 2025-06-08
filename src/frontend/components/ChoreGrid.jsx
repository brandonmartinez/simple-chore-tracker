import React from "react";
import ChoreCell from "./ChoreCell";
import { assignChore, completeChore, removeAssignment } from "../apiService";

function ChoreGrid({
	people,
	groupedChores,
	sortedCategories,
	timePeriod,
	availableTimePeriods,
	setTimePeriod,
	setChores,
}) {
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
		assignChore(choreId, personId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [personId] } : chore
				);
				return updatedChores;
			});
		});
	}

	function handleComplete(choreId) {
		completeChore(choreId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, completed: true } : chore
				);
				return updatedChores;
			});
		});
	}

	function handleRemoveAssignment(choreId) {
		removeAssignment(choreId, timePeriod.id).then(() => {
			setChores((prevChores) => {
				const updatedChores = prevChores.map((chore) =>
					chore.id === choreId ? { ...chore, assignedTo: [] } : chore
				);
				return updatedChores;
			});
		});
	}

	function handleTimePeriodChange(event) {
		const selectedId = parseInt(event.target.value, 10);
		const selectedWeek = availableTimePeriods.find(
			(week) => week.id === selectedId
		);
		if (selectedWeek) {
			setTimePeriod(selectedWeek);
		} else {
			console.error("Selected week not found in availableWeeks.");
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
					id="week-select"
					value={timePeriod?.id || availableTimePeriods[0]?.id || ""}
					onChange={handleTimePeriodChange}
					className="bg-slate-200 dark:bg-slate-700 p-2 border border-slate-300 dark:border-slate-600 rounded text-slate-800 dark:text-slate-100"
				>
					{availableTimePeriods.map((week) => (
						<option
							key={week.id}
							value={week.id}
							className="bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100"
						>
							{formatDate(week.start_date)}
						</option>
					))}
				</select>
			</div>
			{people.map((person) => (
				<div
					key={person.id}
					className="bg-slate-300 dark:bg-slate-600 p-2 rounded font-bold text-center text-slate-800 dark:text-slate-100"
				>
					{person.name}
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
										onAssign={handleAssign}
										onComplete={handleComplete}
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
