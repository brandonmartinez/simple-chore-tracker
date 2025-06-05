import React from "react";

function ChoreCell({
	chore,
	person,
	onAssign,
	onComplete,
	onRemoveAssignment,
}) {
	const isAssigned = chore.assignedTo && chore.assignedTo.includes(person.id);
	const isCompleted = chore.completed;

	return (
		<div
			className={`p-2 text-center rounded ${
				isAssigned ? "border-2 border-green-500" : ""
			}`}
		>
			{!isCompleted && (!chore.assignedTo || !chore.assignedTo.length) && (
				<button
					className="bg-green-500 text-white px-2 py-1 rounded mr-2"
					onClick={() => onAssign(chore.id, person.id)}
					title="Assign Chore"
				>
					➕
				</button>
			)}
			{isAssigned && (
				<button
					className="bg-red-500 text-white px-2 py-1 rounded mr-2"
					onClick={() => onRemoveAssignment(chore.id)}
					title="Remove Assignment"
				>
					❌
				</button>
			)}
			{!isCompleted && (
				<button
					className="bg-blue-500 text-white px-2 py-1 rounded"
					onClick={() => onComplete(chore.id)}
					title="Mark as Completed"
				>
					✅
				</button>
			)}
			{isCompleted && <span>✅ +{chore.points}</span>}
		</div>
	);
}

export default ChoreCell;
