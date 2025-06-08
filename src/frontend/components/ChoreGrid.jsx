import React from "react";
import ChoreCell from "./ChoreCell";

function ChoreGrid({
	people,
	groupedChores,
	sortedCategories,
	timePeriod,
	availableTimePeriods,
	onAssign,
	onComplete,
	onRemoveAssignment,
	onTimePeriodChange,
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
					onChange={onTimePeriodChange}
					className="p-2 border rounded"
				>
					{availableTimePeriods.map((week) => (
						<option key={week.id} value={week.id}>
							{formatDate(week.start_date)}
						</option>
					))}
				</select>
			</div>
			{people.map((person) => (
				<div
					key={person.id}
					className="bg-gray-50 p-2 rounded font-bold text-center text-gray-700"
				>
					{person.name}
				</div>
			))}
			<div></div>
			{sortedCategories.map((category) => (
				<React.Fragment key={category}>
					<h3 className="col-span-full bg-gray-800 p-2 rounded font-semibold text-lg text-white">
						{category}
					</h3>
					{groupedChores[category]
						.sort((a, b) => a.title.localeCompare(b.title))
						.map((chore) => (
							<React.Fragment key={chore.id}>
								<div className="flex items-center bg-gray-50 p-2 rounded font-bold text-gray-700">
									{chore.title}
								</div>
								{people.map((person) => (
									<ChoreCell
										key={person.id}
										chore={chore}
										person={person}
										onAssign={onAssign}
										onComplete={onComplete}
										onRemoveAssignment={onRemoveAssignment}
									/>
								))}
								<div className="flex justify-center items-center bg-gray-700 p-1 rounded font-bold text-gray-300 text-sm">
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
