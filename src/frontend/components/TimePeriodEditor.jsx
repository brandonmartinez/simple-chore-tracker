import React, { useState } from "react";
import EditorGrid from "./EditorGrid";

function TimePeriodEditor({
	timePeriods,
	setTimePeriods,
	onAddTimePeriod,
	onUpdateTimePeriod,
}) {
	const [newTimePeriod, setNewTimePeriod] = useState({
		start_date: "",
		end_date: "",
	});
	const [sortConfig, setSortConfig] = useState({
		key: "start_date",
		direction: "asc",
	});

	const sortedTimePeriods = [...timePeriods].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleEdit = (id, field, value) => {
		setTimePeriods((prevTimePeriods) =>
			prevTimePeriods.map((timePeriod) =>
				timePeriod.id === id ? { ...timePeriod, [field]: value } : timePeriod
			)
		);
	};

	const handleSave = (id) => {
		const timePeriod = timePeriods.find((timePeriod) => timePeriod.id === id);
		onUpdateTimePeriod(id, timePeriod);
	};

	const handleAdd = async () => {
		try {
			const { id } = await onAddTimePeriod(newTimePeriod);
			setTimePeriods((prevTimePeriods) => [
				...prevTimePeriods,
				{ ...newTimePeriod, id },
			]);
			setNewTimePeriod({ start_date: "", end_date: "" });
		} catch (error) {
			console.error("Failed to add time period:", error);
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

	const columns = [
		{
			key: "start_date",
			label: "Start Date",
			onSort: () => handleSort("start_date"),
		},
		{
			key: "end_date",
			label: "End Date",
			onSort: () => handleSort("end_date"),
		},
	];

	return (
		<div>
			<h2 className="mb-4 text-2xl">Time Period Editor</h2>
			<EditorGrid
				items={sortedTimePeriods}
				columns={columns}
				onEdit={handleEdit}
				onSave={handleSave}
				onAdd={handleAdd}
				newItem={newTimePeriod}
				setNewItem={setNewTimePeriod}
			/>
		</div>
	);
}

export default TimePeriodEditor;
