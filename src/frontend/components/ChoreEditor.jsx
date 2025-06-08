import React, { useState } from "react";
import { addChore, markChoreAsDeleted } from "../apiService";

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

	return (
		<div>
			<h2 className="mb-4 text-2xl">Chore Editor</h2>
			<table className="border border-collapse border-gray-300 w-full table-auto">
				<thead>
					<tr className="bg-gray-100">
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("id")}
						>
							ID
						</th>
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("category")}
						>
							Category
						</th>
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("title")}
						>
							Title
						</th>
						<th
							className="px-4 py-2 border border-gray-300 cursor-pointer"
							onClick={() => handleSort("points")}
						>
							Points
						</th>
						<th className="px-4 py-2 border border-gray-300">Actions</th>
					</tr>
				</thead>
				<tbody>
					{sortedChores.map((chore) => (
						<tr key={String(chore.id)} className="hover:bg-gray-50">
							<td className="px-4 py-2 border border-gray-300">
								{String(chore.id)}
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<input
									type="text"
									value={chore.category || ""}
									onChange={(e) =>
										handleEdit(chore.id, "category", e.target.value)
									}
									className="p-2 border border-gray-300 rounded w-full"
								/>
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<input
									type="text"
									value={chore.title || ""}
									onChange={(e) =>
										handleEdit(chore.id, "title", e.target.value)
									}
									className="p-2 border border-gray-300 rounded w-full"
								/>
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<input
									type="number"
									value={chore.points || 0}
									onChange={(e) =>
										handleEdit(chore.id, "points", e.target.value)
									}
									className="p-2 border border-gray-300 rounded w-full"
								/>
							</td>
							<td className="px-4 py-2 border border-gray-300">
								<button
									onClick={() => handleSave(chore.id)}
									className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white"
								>
									Save
								</button>
								<button
									onClick={() => handleDelete(chore.id)}
									className="bg-red-500 hover:bg-red-600 ml-2 px-4 py-2 rounded text-white"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
					<tr className="hover:bg-gray-50">
						<td className="px-4 py-2 border border-gray-300">New</td>
						<td className="px-4 py-2 border border-gray-300">
							<input
								type="text"
								value={newChore.category || ""}
								onChange={(e) =>
									setNewChore({ ...newChore, category: e.target.value })
								}
								className="p-2 border border-gray-300 rounded w-full"
							/>
						</td>
						<td className="px-4 py-2 border border-gray-300">
							<input
								type="text"
								value={newChore.title || ""}
								onChange={(e) =>
									setNewChore({ ...newChore, title: e.target.value })
								}
								className="p-2 border border-gray-300 rounded w-full"
							/>
						</td>
						<td className="px-4 py-2 border border-gray-300">
							<input
								type="number"
								value={newChore.points || 0}
								onChange={(e) =>
									setNewChore({ ...newChore, points: e.target.value })
								}
								className="p-2 border border-gray-300 rounded w-full"
							/>
						</td>
						<td className="px-4 py-2 border border-gray-300">
							<button
								onClick={handleAdd}
								className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white"
							>
								Add
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default ChoreEditor;
