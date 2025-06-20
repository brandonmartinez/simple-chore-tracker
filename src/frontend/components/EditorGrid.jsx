import React, { useState } from "react";

function EditorGrid({
	config,
	columns,
	items,
	setItems,
	onAdd,
	onUpdate,
	onDelete,
	newTemplate,
}) {
	const defaultNewTemplate = () => {
		return columns.reduce((acc, column) => {
			acc[column.key] = column.defaultValue || "";
			return acc;
		}, {});
	};

	const createNewItem =
		typeof newTemplate === "function" ? newTemplate : defaultNewTemplate;

	const [newItem, setNewItem] = useState(createNewItem);
	const [sortConfig, setSortConfig] = useState({
		key: config.defaultSort || "id",
		direction: "asc",
	});
	const [editedValues, setEditedValues] = useState({});

	const handleEdit = (id, key, value) => {
		setEditedValues((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				[key]: value,
			},
		}));
	};

	const handleDelete = async (id) => {
		if (
			!window.confirm(
				`Are you sure you want to delete this ${config.singular}?`
			)
		) {
			return;
		}
		try {
			await onDelete(id);
			setItems((prevItems) =>
				prevItems.map((item) =>
					item.id === id ? { ...item, deleted: true } : item
				)
			);
		} catch (error) {
			console.error(`Failed to mark ${config.singular} as deleted:`, error);
		}
	};

	const sortedItems = [...items].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

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

	const handleSave = async (id) => {
		// Add animation to the save button when clicked
		const saveButton = document.getElementById(`save-button-${id}`);
		if (saveButton) {
			saveButton.classList.add("animate-pulse");
		}

		const columnKeys = columns.map((column) => column.key);
		const updatedItem = {
			id,
			...Object.fromEntries(
				Object.entries(items.find((item) => item.id === id) || {}).filter(
					([key]) => columnKeys.includes(key)
				)
			),
			...Object.fromEntries(
				Object.entries(editedValues[id] || {}).filter(([key]) =>
					columnKeys.includes(key)
				)
			),
		};
		try {
			await onUpdate(id, updatedItem);
			setEditedValues((prev) => {
				const { [id]: _, ...rest } = prev;
				return rest;
			});
			setItems((prevItems) =>
				prevItems.map((item) => (item.id === id ? updatedItem : item))
			);
		} catch (error) {
			console.error(`Failed to update ${config.singular}:`, error);
		} finally {
			if (saveButton) {
				saveButton.classList.remove("animate-pulse");
			}
		}
	};

	const handleAdd = async () => {
		// Check required fields based on column config
		const missingRequired = columns.some(
			(column) => column.required && !newItem[column.key]
		);
		if (missingRequired) {
			alert("Please fill in all required fields before adding a new item.");
			return;
		}
		try {
			const addedItem = await onAdd(newItem);
			setItems((prevItems) => [...prevItems, addedItem]);
			setNewItem(createNewItem);
		} catch (error) {
			console.error(`Failed to add new ${config.singular}:`, error);
		}
	};

	// Add a utility function to format the date for the input field
	const formatDateForInput = (dateString) => {
		const date = new Date(dateString);
		return date.toISOString().split("T")[0]; // Extract only the date part
	};

	// Add a utility function to parse the date back to ISO format
	const parseDateFromInput = (dateString) => {
		const date = new Date(dateString);
		return date.toISOString();
	};

	return (
		<table className="border border-collapse border-slate-300 dark:border-slate-600 rounded-lg w-full table-auto">
			<thead>
				<tr className="bg-slate-300 dark:bg-slate-600">
					{columns.map((column) => (
						<th
							key={column.key}
							className="px-4 py-2 text-slate-800 dark:text-slate-100 cursor-pointer"
							onClick={() => handleSort(column.key)}
						>
							{column.label}
						</th>
					))}
					<th className="px-4 py-2 text-slate-800 dark:text-slate-100">
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{sortedItems.map((item, index) => (
					<tr
						key={String(item.id)}
						className={index % 2 === 0 ? "" : "bg-slate-200 dark:bg-slate-800"}
					>
						{columns.map((column) => (
							<td key={column.key} className="px-4 py-2">
								<input
									type={column.type || "text"}
									value={
										column.type === "date"
											? formatDateForInput(
													editedValues[item.id]?.[column.key] ??
														item[column.key] ??
														""
											  )
											: editedValues[item.id]?.[column.key] ??
											  item[column.key] ??
											  ""
									}
									onChange={(e) =>
										handleEdit(
											item.id,
											column.key,
											column.type === "date"
												? parseDateFromInput(e.target.value)
												: e.target.value
										)
									}
									className={`p-2 border rounded w-full text-slate-800 dark:text-slate-100 ${
										column.required &&
										!(
											editedValues[item.id]?.[column.key] ??
											item[column.key] ??
											""
										)
											? "border-red-500"
											: editedValues[item.id]?.[column.key] !== undefined
											? "border-green-500"
											: "border-slate-300 dark:border-slate-600"
									}`}
								/>
							</td>
						))}
						<td className="px-4 py-2">
							<button
								id={`save-button-${item.id}`}
								onClick={() => handleSave(item.id)}
								disabled={
									!editedValues[item.id] ||
									Object.keys(editedValues[item.id]).length === 0 ||
									columns.some(
										(column) =>
											column.required &&
											!(
												editedValues[item.id]?.[column.key] ??
												item[column.key] ??
												""
											)
									)
								}
								className={`bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-white ${
									!editedValues[item.id] ||
									Object.keys(editedValues[item.id]).length === 0 ||
									columns.some(
										(column) =>
											column.required &&
											!(
												editedValues[item.id]?.[column.key] ??
												item[column.key] ??
												""
											)
									)
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
							>
								Save
							</button>
							<button
								onClick={() => handleDelete(item.id)}
								className="bg-rose-500 hover:bg-rose-600 ml-2 px-4 py-2 rounded text-white"
							>
								Delete
							</button>
						</td>
					</tr>
				))}
				<tr className="bg-slate-200 dark:bg-slate-700">
					{columns.map((column) => (
						<td key={column.key} className="px-4 py-2">
							<input
								type={column.type || "text"}
								value={newItem[column.key] || ""}
								onChange={(e) =>
									setNewItem({ ...newItem, [column.key]: e.target.value })
								}
								className="p-2 border border-slate-300 dark:border-slate-600 rounded w-full text-slate-800 dark:text-slate-100"
							/>
						</td>
					))}
					<td className="px-4 py-2">
						<button
							onClick={handleAdd}
							disabled={columns.some(
								(column) => column.required && !newItem[column.key]
							)}
							className={`bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-white ${
								columns.some(
									(column) => column.required && !newItem[column.key]
								)
									? "opacity-50 cursor-not-allowed"
									: ""
							}`}
						>
							Add
						</button>
						<button
							onClick={() => setNewItem(createNewItem)}
							className="bg-gray-500 hover:bg-gray-600 ml-2 px-4 py-2 rounded text-white"
						>
							Reset
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default EditorGrid;
