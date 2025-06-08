import React from "react";

function EditorGrid({
	items,
	columns,
	onEdit,
	onSave,
	onDelete,
	onAdd,
	newItem,
	setNewItem,
}) {
	return (
		<table className="border border-collapse border-slate-300 dark:border-slate-600 rounded-lg w-full table-auto">
			<thead>
				<tr className="bg-slate-300 dark:bg-slate-600">
					{columns.map((column) => (
						<th
							key={column.key}
							className="px-4 py-2 text-slate-800 dark:text-slate-100 cursor-pointer"
							onClick={column.onSort}
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
				{items.map((item, index) => (
					<tr
						key={String(item.id)}
						className={index % 2 === 0 ? "" : "bg-slate-200 dark:bg-slate-800"}
					>
						{columns.map((column) => (
							<td key={column.key} className="px-4 py-2">
								<input
									type={column.type || "text"}
									value={item[column.key] || ""}
									onChange={(e) => onEdit(item.id, column.key, e.target.value)}
									className="p-2 border border-slate-300 dark:border-slate-600 rounded w-full text-slate-800 dark:text-slate-100"
								/>
							</td>
						))}
						<td className="px-4 py-2">
							<button
								onClick={() => onSave(item.id)}
								className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded text-white"
							>
								Save
							</button>
							<button
								onClick={() => onDelete(item.id)}
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
