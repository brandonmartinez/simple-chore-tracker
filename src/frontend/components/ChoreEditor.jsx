import React, { useState } from "react";
import { addChore, markChoreAsDeleted } from "../apiService";
import EditorGrid from "./EditorGrid";

function ChoreEditor({ chores, setChores, onAddChore, onUpdateChore }) {
	const [newChore, setNewChore] = useState({
		title: "",
		points: 0,
		category: "",
	});
	const [sortConfig, setSortConfig] = useState({
		key: "category",
		direction: "asc",
	});

	const sortedChores = [...chores].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleEdit = (id, field, value) => {
		setChores((prevChores) =>
			prevChores.map((chore) =>
				chore.id === id ? { ...chore, [field]: value } : chore
			)
		);
	};

	const handleSave = (id) => {
		const chore = chores.find((chore) => chore.id === id);
		onUpdateChore(id, chore);
	};

	const handleAdd = async () => {
		try {
			const { id } = await addChore(newChore);
			setChores((prevChores) => [...prevChores, { ...newChore, id }]);
			setNewChore({ title: "", points: 0, category: "" });
		} catch (error) {
			console.error("Failed to add chore:", error);
		}
	};

	const handleSort = (key) => {
		setSortConfig((prevConfig) => {
			if (prevConfig.key === key) {
				return {
					key,
					direction: prevConfig.direction === "asc" ? "desc" : "asc",
				};
			}
			return { key, direction: "asc" };
		});
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this chore?")) {
			return;
		}
		try {
			await markChoreAsDeleted(id);
			setChores((prevChores) =>
				prevChores.map((chore) =>
					chore.id === id ? { ...chore, deleted: true } : chore
				)
			);
		} catch (error) {
			console.error("Failed to mark chore as deleted:", error);
		}
	};

	const columns = [
		{
			key: "category",
			label: "Category",
			onSort: () => handleSort("category"),
		},
		{ key: "title", label: "Title", onSort: () => handleSort("title") },
		{
			key: "points",
			label: "Points",
			onSort: () => handleSort("points"),
			type: "number",
		},
	];

	return (
		<div>
			<h2 className="mb-4 text-2xl">Chore Editor</h2>
			<EditorGrid
				items={sortedChores}
				columns={columns}
				onEdit={handleEdit}
				onSave={handleSave}
				onDelete={handleDelete}
				onAdd={handleAdd}
				newItem={newChore}
				setNewItem={setNewChore}
			/>
		</div>
	);
}

export default ChoreEditor;
