import React from "react";
import ChoreCell from "./ChoreCell";

function ChoreGrid({
	people,
	groupedChores,
	sortedCategories,
	onAssign,
	onComplete,
	onRemoveAssignment,
}) {
	return (
		<div
			className="grid gap-4"
			style={{ gridTemplateColumns: `repeat(${people.length + 1}, 1fr)` }}
		>
			<div></div>
			{people.map((person) => (
				<div
					key={person.id}
					className="font-bold text-center bg-gray-50 p-2 rounded"
				>
					{person.name}
				</div>
			))}
			{sortedCategories.map((category) => (
				<React.Fragment key={category}>
					<h3 className="col-span-full text-lg font-semibold text-white bg-gray-800 p-2 rounded">
						{category}
					</h3>
					{groupedChores[category]
						.sort((a, b) => a.title.localeCompare(b.title))
						.map((chore) => (
							<React.Fragment key={chore.id}>
								<div className="font-bold text-gray-700 bg-gray-50 p-2 rounded">
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
							</React.Fragment>
						))}
				</React.Fragment>
			))}
		</div>
	);
}

export default ChoreGrid;
