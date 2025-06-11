import React, { useState } from "react";

function EditorGrid({
	config,
	columns,
	items,
	setItems,
	onAdd,
	onUpdate,
	onDelete,
}) {
	const [newItem, setNewItem] = useState(() => {
		const defaultValues = columns.reduce((acc, column) => {
			acc[column.key] = column.defaultValue || "";
			return acc;
		}, {});
		return defaultValues;
	});
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
		const updatedItem = {
			...items.find((item) => item.id === id),
			...editedValues[id],
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
		}
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
										editedValues[item.id]?.[column.key] ??
										item[column.key] ??
										""
									}
									onChange={(e) =>
										handleEdit(item.id, column.key, e.target.value)
									}
									className="p-2 border border-slate-300 dark:border-slate-600 rounded w-full text-slate-800 dark:text-slate-100"
								/>
							</td>
						))}
						<td className="px-4 py-2">
							<button
								onClick={() => handleSave(item.id)}
								className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-white"
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
							onClick={onAdd}
							className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-white"
						>
							Add
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	);
}

export default EditorGrid;
