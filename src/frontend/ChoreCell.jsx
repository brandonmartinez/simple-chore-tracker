import React from "react";

function ChoreCell({ chore, person, onAssign, onComplete }) {
	const isAssigned = chore.assignedTo && chore.assignedTo.includes(person.id);
	const isCompleted = chore.completed;

	return (
		<div className={`p-2 text-center rounded`}>
			{isCompleted ? (
				<span>✅ +{chore.points}</span>
			) : isAssigned ? (
				<button
					className="bg-blue-500 text-white px-2 py-1 rounded"
					onClick={() => onComplete(chore.id)}
				>
					✅ Mark as Completed
				</button>
			) : !chore.assignedTo || !chore.assignedTo.length ? (
				<button
					className="bg-green-500 text-white px-2 py-1 rounded"
					onClick={() => onAssign(chore.id, person.id)}
				>
					➕ Assign
				</button>
			) : null}
		</div>
	);
}

export default ChoreCell;
