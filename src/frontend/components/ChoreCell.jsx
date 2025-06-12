import React from "react";

function ChoreCell({
	chore,
	person,
	completions,
	isAssigned,
	onAssign,
	onComplete,
	onRemoveAssignment,
}) {
	const totalCompletionPoints = completions
		? Object.values(completions).reduce(
				(sum, completion) => sum + (completion.points_earned || 0),
				0
		  )
		: 0;

	return (
		<div
			className={`p-2 text-center rounded ${
				isAssigned ? "border-2 border-green-500" : ""
			}`}
		>
			{!isAssigned && (
				<button
					className="bg-green-500 mr-2 px-2 py-1 rounded text-white"
					onClick={() => onAssign(chore.id, person.id)}
					title="Assign Chore"
				>
					➕
				</button>
			)}
			{isAssigned && (
				<button
					className="bg-red-500 mr-2 px-2 py-1 rounded text-white"
					onClick={() => onRemoveAssignment(chore.id)}
					title="Remove Assignment"
				>
					❌
				</button>
			)}

			<button
				className="bg-blue-500 px-2 py-1 rounded text-white"
				onClick={() => onComplete(chore.id, person.id)}
				title="Mark as Completed"
			>
				✅
			</button>

			<div className="flex justify-center items-center mt-2 font-semibold text-sm">
				<span role="img" aria-label="plus">
					➕
				</span>
				<span className="ml-1">{totalCompletionPoints}</span>
			</div>
		</div>
	);
}

export default ChoreCell;
