import React from "react";
import {
	addReward,
	removeReward,
	updateReward,
} from "../services/rewardsApiService";
import EditorGrid from "./EditorGrid";

function RewardEditor({ rewards, setRewards }) {
	const columns = [
		{ key: "title", label: "Title", onSort: () => handleSort("title") },
		{
			key: "points_cost",
			label: "Points Cost",
			onSort: () => handleSort("points_cost"),
			type: "number",
		},
	];

	return (
		<div>
			<h2 className="mb-4 text-2xl">Reward Editor</h2>
			<EditorGrid
				config={{
					singular: "reward",
					plural: "rewards",
					defaultSort: "title",
				}}
				columns={columns}
				items={rewards}
				setItems={setRewards}
				onAdd={addReward}
				onUpdate={updateReward}
				onDelete={removeReward}
			/>
		</div>
	);
}

export default RewardEditor;
