import React from "react";
import {
	addChore,
	removeChore,
	updateChore,
} from "../services/choresApiService";
import EditorGrid from "./EditorGrid";

function ChoreEditor({ chores, setChores }) {
	const columns = [
		{
			key: "category",
			label: "Category",
		},
		{ key: "title", label: "Title" },
		{
			key: "points",
			label: "Points",
			type: "number",
		},
	];

	return (
		<div>
			<h2 className="mb-4 text-2xl">Chore Editor</h2>
			<EditorGrid
				config={{
					singular: "chore",
					plural: "chores",
					defaultSort: "category",
				}}
				columns={columns}
				items={chores}
				setItems={setChores}
				onAdd={addChore}
				onUpdate={updateChore}
				onDelete={removeChore}
			/>
		</div>
	);
}

export default ChoreEditor;
