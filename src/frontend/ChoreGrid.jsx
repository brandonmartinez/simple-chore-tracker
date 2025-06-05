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
			style={{
				gridTemplateColumns: `repeat(${people.length + 1}, 1fr) 0.25fr`,
			}}
		>
			<div></div>
			{people.map((person) => (
				<div
					key={person.id}
					className="font-bold text-center bg-gray-50 text-gray-700 p-2 rounded"
				>
					{person.name}
				</div>
			))}
			<div></div>
			{sortedCategories.map((category) => (
				<React.Fragment key={category}>
					<h3 className="col-span-full text-lg font-semibold text-white bg-gray-800 p-2 rounded">
						{category}
					</h3>
					{groupedChores[category]
						.sort((a, b) => a.title.localeCompare(b.title))
						.map((chore) => (
							<React.Fragment key={chore.id}>
								<div className="font-bold text-gray-700 bg-gray-50 p-2 rounded flex items-center">
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
								<div className="flex items-center justify-center text-sm font-bold text-gray-300 bg-gray-700 p-1 rounded">
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
