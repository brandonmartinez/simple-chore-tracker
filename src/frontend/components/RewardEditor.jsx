import React, { useState } from "react";
import { addReward, markRewardAsDeleted } from "../apiService";
import EditorGrid from "./EditorGrid";

function RewardEditor({ rewards, setRewards, onAddReward, onUpdateReward }) {
	const [newReward, setNewReward] = useState({
		title: "",
		points_cost: 0,
	});
	const [sortConfig, setSortConfig] = useState({
		key: "title",
		direction: "asc",
	});

	const sortedRewards = [...rewards].sort((a, b) => {
		if (!sortConfig.key) return 0;
		const aValue = a[sortConfig.key];
		const bValue = b[sortConfig.key];
		if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
		if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
		return 0;
	});

	const handleEdit = (id, field, value) => {
		setRewards((prevRewards) =>
			prevRewards.map((reward) =>
				reward.id === id ? { ...reward, [field]: value } : reward
			)
		);
	};

	const handleSave = (id) => {
		const reward = rewards.find((reward) => reward.id === id);
		onUpdateReward(id, reward);
	};

	const handleAdd = async () => {
		try {
			const { id } = await addReward(newReward);
			setRewards((prevRewards) => [...prevRewards, { ...newReward, id }]);
			setNewReward({ title: "", points_cost: 0 });
		} catch (error) {
			console.error("Failed to add reward:", error);
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
		if (!window.confirm("Are you sure you want to delete this reward?")) {
			return;
		}
		try {
			await markRewardAsDeleted(id);
			setRewards((prevRewards) =>
				prevRewards.map((reward) =>
					reward.id === id ? { ...reward, deleted: true } : reward
				)
			);
		} catch (error) {
			console.error("Failed to mark reward as deleted:", error);
		}
	};

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
				items={sortedRewards}
				columns={columns}
				onEdit={handleEdit}
				onSave={handleSave}
				onDelete={handleDelete}
				onAdd={handleAdd}
				newItem={newReward}
				setNewItem={setNewReward}
			/>
		</div>
	);
}

export default RewardEditor;
